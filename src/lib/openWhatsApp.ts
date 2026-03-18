const PHONE = "918527914317";

/**
 * Open WhatsApp with a pre-filled message.
 *
 * - If `appDetected` is true  → go straight to the whatsapp:// URI (desktop/mobile app).
 * - If `appDetected` is false → go straight to WhatsApp Web.
 * - If `appDetected` is undefined (unknown) → try the app URI and fall back to
 *   WhatsApp Web after 1 s if the window never blurs (app not installed).
 */
export function openWhatsApp(message: string, appDetected?: boolean) {
  const encoded = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${PHONE}&text=${encoded}`;
  const webUrl = `https://web.whatsapp.com/send/?phone=${PHONE}&text=${encoded}&type=phone_number&app_absent=0`;

  if (appDetected === true) {
    window.location.href = appUrl;
    return;
  }

  if (appDetected === false) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  // Unknown — try app, fall back to web after 1 s if window doesn't blur
  const fallback = setTimeout(() => {
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }, 1000);

  window.addEventListener("blur", () => clearTimeout(fallback), { once: true });
  window.location.href = appUrl;
}
