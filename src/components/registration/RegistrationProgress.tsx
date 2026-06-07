const STEPS = [
  { id: 1, label: "Category" },
  { id: 2, label: "Your details" },
  { id: 3, label: "Payment & confirm" },
] as const;

export default function RegistrationProgress({
  currentStep,
}: {
  currentStep: 1 | 2 | 3;
}) {
  const progress = Math.round((currentStep / 3) * 100);

  return (
    <nav aria-label="Registration progress" className="mb-8">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex w-full flex-col items-center text-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
                    done
                      ? "bg-brand-emerald text-white"
                      : active
                        ? "bg-brand-saffron text-brand-navy"
                        : "bg-slate-200 text-slate-500"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : step.id}
                </span>
                <span
                  className={`mt-2 hidden text-xs font-semibold sm:block ${
                    active ? "text-brand-navy" : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-1 hidden h-0.5 flex-1 sm:block ${
                    done ? "bg-brand-emerald" : "bg-slate-200"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-navy to-brand-saffron transition-all duration-500"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </nav>
  );
}
