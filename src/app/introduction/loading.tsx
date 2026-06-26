export default function IntroductionLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-16">
      <div className="h-8 w-2/3 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  );
}
