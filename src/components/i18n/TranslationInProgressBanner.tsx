import Link from "next/link";

type Props = {
  message: string;
  englishHref?: string;
  englishLabel?: string;
};

export default function TranslationInProgressBanner({
  message,
  englishHref = "/",
  englishLabel = "English version",
}: Props) {
  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950"
    >
      <span>{message}</span>{" "}
      <Link href={englishHref} className="font-semibold underline decoration-amber-400">
        {englishLabel}
      </Link>
    </div>
  );
}
