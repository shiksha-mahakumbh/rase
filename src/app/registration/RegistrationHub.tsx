"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import RegistrationShell from "@/app/component/ui/RegistrationShell";
import {
  EVENT_NAME,
  RegistrationType,
} from "@/types/registration";
import DelegateForm from "@/components/forms/DelegateForm";
import ConclaveForm from "@/components/forms/ConclaveForm";
import BestPracticeForm from "@/components/forms/BestPracticeForm";
import OlympiadForm from "@/components/forms/OlympiadForm";
import AwardsForm from "@/components/forms/AwardsForm";
import GenericRegistrationForm from "@/components/forms/GenericRegistrationForm";
import RegistrationProgress from "@/components/registration/RegistrationProgress";
import CategoryStep from "@/components/registration/CategoryStep";
import { loadMeta, saveMeta } from "@/lib/registration/draftStorage";
import RecaptchaScript from "@/components/security/RecaptchaProvider";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import RegistrationTrustBar from "@/components/registration/RegistrationTrustBar";

function RegistrationFormRouter({
  type,
  step,
  onContinueToPayment,
}: {
  type: RegistrationType;
  step: 2 | 3;
  onContinueToPayment: () => void;
}) {
  const visibilityClass =
    step === 2
      ? "[&_.registration-payment]:hidden [&_button[type=submit]]:hidden"
      : "[&_.registration-details]:hidden";

  const form = (() => {
    switch (type) {
      case "Delegate Registration":
        return <DelegateForm />;
      case "Conclave":
        return <ConclaveForm />;
      case "Best Practices":
        return <BestPracticeForm />;
      case "Olympiad":
        return <OlympiadForm />;
      case "Awards":
        return <AwardsForm />;
      case "Exhibition":
        return (
          <GenericRegistrationForm
            registrationType="Exhibition"
            sectionTitle="Exhibition Registration"
          />
        );
      case "Projects":
        return (
          <GenericRegistrationForm
            registrationType="Projects"
            sectionTitle="Projects Registration"
          />
        );
      case "Bal Shodh Patrika":
        return (
          <GenericRegistrationForm
            registrationType="Bal Shodh Patrika"
            sectionTitle="Bal Shodh Patrika Registration"
          />
        );
      case "Cultural Program":
        return (
          <GenericRegistrationForm
            registrationType="Cultural Program"
            sectionTitle="Cultural Program Registration"
          />
        );
      case "Accommodation":
        return (
          <GenericRegistrationForm
            registrationType="Accommodation"
            sectionTitle="Accommodation Registration"
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className={visibilityClass}>
      {form}
      {step === 2 && (
        <button
          type="button"
          onClick={onContinueToPayment}
          className="mt-4 w-full min-h-[48px] rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy-light"
        >
          Continue to payment &amp; confirmation →
        </button>
      )}
    </div>
  );
}

export default function RegistrationHub() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("Delegate Registration");

  useEffect(() => {
    const meta = loadMeta();
    if (meta?.registrationType) {
      setRegistrationType(meta.registrationType);
      if (meta.step >= 2 && meta.step <= 3) {
        setStep(meta.step as 2 | 3);
      }
    }
  }, []);

  useEffect(() => {
    if (step > 1) {
      saveMeta({
        step,
        registrationType,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [step, registrationType]);

  const goToPayment = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <RecaptchaScript />
      <Toaster position="top-center" />
      <RegistrationShell
        title={EVENT_NAME}
        subtitle="Official registration — national education movement & global summit"
        step={step}
        totalSteps={3}
      >
        <RegistrationProgress currentStep={step} />
        <RegistrationTrustBar />

        {step === 1 && (
          <CategoryStep
            value={registrationType}
            onChange={(t) => {
              setRegistrationType(t);
              setStep(1);
            }}
            onContinue={() => {
              trackEvent(ANALYTICS_EVENTS.registrationStarted, {
                registrationType,
                step: 2,
              });
              setStep(2);
            }}
          />
        )}

        {step >= 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span>
                <strong className="text-brand-navy">{registrationType}</strong>
              </span>
              <button
                type="button"
                className="font-semibold text-brand-saffron underline"
                onClick={() => setStep(1)}
              >
                Change category
              </button>
            </div>

            {step === 2 && (
              <p className="text-sm text-slate-600">
                Fill your details below. Progress is saved automatically if you leave
                this page.
              </p>
            )}
            {step === 3 && (
              <p className="text-sm text-slate-600">
                Complete payment (if required) and submit your registration.
              </p>
            )}

            {(step === 2 || step === 3) && (
              <RegistrationFormRouter
                type={registrationType}
                step={step}
                onContinueToPayment={goToPayment}
              />
            )}

            {step === 3 && (
              <button
                type="button"
                className="text-sm font-semibold text-brand-navy underline"
                onClick={() => setStep(2)}
              >
                ← Back to details
              </button>
            )}
          </div>
        )}
      </RegistrationShell>
    </>
  );
}
