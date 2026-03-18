const PHONE = "918527914317";

export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  const url = `https://web.whatsapp.com/send/?phone=${PHONE}&text=${encoded}&type=phone_number&app_absent=0`;
  window.open(url, "_blank", "noopener,noreferrer");
}
