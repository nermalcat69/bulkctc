const PHONE = "918527914317";

/**
 * Try to open the WhatsApp desktop/mobile app via the whatsapp:// URI scheme.
 * If the app isn't installed the window won't lose focus, so after 1 s we fall
 * back to WhatsApp Web in a new tab.
 */
export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const appUrl = `whatsapp://send?phone=${PHONE}&text=${encoded}`;
  const webUrl = `https://web.whatsapp.com/send/?phone=${PHONE}&text=${encoded}&type=phone_number&app_absent=0`;

  const fallback = setTimeout(() => {
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }, 1000);

  // If the app opens, the browser window loses focus — cancel the web fallback
  window.addEventListener("blur", () => clearTimeout(fallback), { once: true });

  window.location.href = appUrl;
}
