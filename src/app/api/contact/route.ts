import { NextRequest, NextResponse } from "next/server";

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute per IP
// Hard cap: prevents unbounded growth under high unique-IP traffic.
// At ~100 bytes per entry this is ~100 KB max.
const MAX_RATE_LIMIT_ENTRIES = 1000;
const RATE_LIMIT_STORAGE = new Map<
  string,
  { count: number; resetTime: number }
>();

// Lazy cleanup: called on every request instead of a persistent setInterval.
// This avoids an immortal timer that blocks GC and duplicates across hot-reloads.
function purgeExpiredRateLimitEntries(): void {
  if (RATE_LIMIT_STORAGE.size === 0) return;
  const now = Date.now();
  for (const [ip, data] of RATE_LIMIT_STORAGE.entries()) {
    if (now > data.resetTime) {
      RATE_LIMIT_STORAGE.delete(ip);
    }
  }
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

function getClientIP(request: NextRequest): string {
  // Try to get real IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();

  // Fallback for unknown IP
  return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  // Purge expired entries on every request (lazy cleanup — no persistent timer).
  purgeExpiredRateLimitEntries();

  const now = Date.now();
  const clientData = RATE_LIMIT_STORAGE.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // Enforce hard cap: if the Map is full after cleanup, reject new entries
    // rather than growing without bound.
    if (!clientData && RATE_LIMIT_STORAGE.size >= MAX_RATE_LIMIT_ENTRIES) {
      // Treat as rate-limited to protect memory; real users retry shortly.
      return { allowed: false, resetTime: now + RATE_LIMIT_WINDOW };
    }
    // First request or window expired — start a fresh window.
    RATE_LIMIT_STORAGE.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      resetTime: clientData.resetTime,
    };
  }

  // Increment count
  clientData.count++;
  RATE_LIMIT_STORAGE.set(ip, clientData);

  return { allowed: true };
}

function validateContactData(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== "string" ||
    data.name.trim().length === 0
  ) {
    errors.push("Name is required");
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email format");
    } else if (data.email.length > 254) {
      errors.push("Email must be less than 254 characters");
    }
  }

  if (
    !data.company ||
    typeof data.company !== "string" ||
    data.company.trim().length === 0
  ) {
    errors.push("Company name is required");
  } else if (data.company.trim().length > 100) {
    errors.push("Company name must be less than 100 characters");
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length === 0
  ) {
    errors.push("Message is required");
  } else if (data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.trim().length > 2000) {
    errors.push("Message must be less than 2000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function sendWebhook(
  data: ContactFormData,
  metadata: { ip: string; userAgent: string; timestamp: string },
) {
  // You can configure this webhook URL in environment variables
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("No webhook URL configured, logging contact form submission:", {
      ...data,
      metadata,
    });
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Gray Cup-Contact-Form/1.0",
      },
      body: JSON.stringify({
        type: "contact_form_submission",
        data,
        metadata,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Webhook failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Webhook error:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime || Date.now();
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
          },
        },
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    // Validate input data
    const validation = validateContactData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      );
    }

    // Sanitize data
    const contactData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company.trim(),
      message: body.message.trim(),
    };

    // Prepare metadata
    const userAgent = request.headers.get("user-agent") || "unknown";
    const metadata = {
      ip: clientIP,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    // Send to webhook (async, don't wait)
    sendWebhook(contactData, metadata).catch((error) => {
      console.error("Webhook sending failed:", error);
    });

    // Return success response immediately
    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
          "X-RateLimit-Remaining": (
            MAX_REQUESTS_PER_WINDOW -
            (RATE_LIMIT_STORAGE.get(clientIP)?.count || 0)
          ).toString(),
        },
      },
    );
  } catch (error) {
    console.error("Contact form API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
