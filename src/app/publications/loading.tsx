export default function PublicationsLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-16">
      <div className="h-8 w-1/3 rounded bg-slate-200" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
