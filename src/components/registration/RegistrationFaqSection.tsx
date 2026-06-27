import { REGISTRATION_FAQ } from "@/data/registration-hub";

export default function RegistrationFaqSection() {
  return (
    <section
      aria-labelledby="registration-faq-heading"
      className="border-t border-brand-navy/10 bg-brand-surface-warm py-12"
    >
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <h2
          id="registration-faq-heading"
          className="text-center text-xl font-bold text-brand-navy md:text-2xl"
        >
          Registration FAQ
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Common questions about categories, fees, and your participant portal.
        </p>
        <dl className="mt-8 space-y-4">
          {REGISTRATION_FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <dt className="text-sm font-bold text-brand-navy">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
