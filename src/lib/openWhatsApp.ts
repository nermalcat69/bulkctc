const PHONE = "918527914317";

export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send/?phone=${PHONE}&text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
