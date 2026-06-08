"use client";

interface PressShareButtonsProps {
  shareUrl: string;
  shareText: string;
  shareImage?: string;
}

export default function PressShareButtons({
  shareUrl,
  shareText,
  shareImage,
}: PressShareButtonsProps) {
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const pictureParam = shareImage ? `&picture=${encodeURIComponent(shareImage)}` : "";

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}${pictureParam}`,
      className:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}${pictureParam}`,
      className:
        "bg-brand-navy text-white hover:bg-brand-navy-light focus-visible:outline-brand-navy",
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      className:
        "bg-sky-600 text-white hover:bg-sky-700 focus-visible:outline-sky-600",
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent("Shiksha Mahakumbh Press Release")}&body=${encodedText}%20${encodedUrl}`,
      className:
        "border-2 border-brand-navy/20 bg-white text-brand-navy hover:bg-brand-navy/5 focus-visible:outline-brand-saffron",
    },
  ];

  return (
    <nav aria-label="Share this press release" className="mt-8">
      <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
        Share
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${link.className}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
