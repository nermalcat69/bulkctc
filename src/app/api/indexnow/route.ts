import { submitToIndexNow } from "@/lib/indexnow";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const urls: unknown = body?.urls;

    if (!Array.isArray(urls) || urls.length === 0) {
      return Response.json(
        { error: "Body must contain a non-empty 'urls' array" },
        { status: 400 }
      );
    }

    if (urls.length > 10_000) {
      return Response.json(
        { error: "URL list exceeds maximum of 10,000" },
        { status: 400 }
      );
    }

    if (!process.env.INDEXNOW_KEY) {
      return Response.json({ error: "INDEXNOW_KEY not set" }, { status: 500 });
    }

    await submitToIndexNow(urls as string[]);

    return Response.json({ success: true, submitted: urls.length });
  } catch {
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
