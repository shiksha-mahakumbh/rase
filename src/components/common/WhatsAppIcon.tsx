import OptimizedImage from "@/components/media/OptimizedImage";

const WHATSAPP_ICON =
  "https://img.icons8.com/ios-filled/20/25D366/whatsapp.png";

export default function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <OptimizedImage
      src={WHATSAPP_ICON}
      alt="WhatsApp"
      width={20}
      height={20}
      className={`inline-block align-middle ${className}`}
      enableBlur={false}
    />
  );
}
