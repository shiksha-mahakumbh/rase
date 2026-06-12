"use client";

export default function SeoPreview({
  title,
  description,
  url,
  imageUrl,
}: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}) {
  const displayUrl = url || "https://www.rase.co.in/example";
  const displayTitle = title || "Page title — Shiksha Mahakumbh";
  const displayDesc =
    description ||
    "Meta description appears here. Keep it between 120–160 characters for best results.";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-400">Google preview</p>
        <p className="text-sm text-[#1a0dab]">{displayUrl}</p>
        <p className="text-lg text-[#1a0dab] hover:underline">{displayTitle}</p>
        <p className="text-sm text-slate-600">{displayDesc}</p>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-400">Facebook preview</p>
        {imageUrl && (
          <div className="mb-2 h-28 rounded bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
        )}
        <p className="text-xs uppercase text-slate-400">rase.co.in</p>
        <p className="font-semibold text-slate-900">{displayTitle}</p>
        <p className="text-sm text-slate-600 line-clamp-2">{displayDesc}</p>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-400">Twitter preview</p>
        {imageUrl && (
          <div className="mb-2 h-28 rounded-2xl bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
        )}
        <p className="font-semibold">{displayTitle}</p>
        <p className="text-sm text-slate-600 line-clamp-2">{displayDesc}</p>
      </div>
    </div>
  );
}
