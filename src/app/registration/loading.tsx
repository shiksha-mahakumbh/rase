export default function RegistrationLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-16">
      <div className="h-10 w-1/2 rounded bg-slate-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
