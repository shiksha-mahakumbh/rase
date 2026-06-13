"use client";

import { useEffect, useMemo, useState } from "react";
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
import { RegistrationFlowProvider } from "@/components/registration/RegistrationFlowContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import RegistrationTrustBar from "@/components/registration/RegistrationTrustBar";
import {
  isExternalRedirectType,
  requiresPaymentStep,
} from "@/lib/registration/config";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";

function RegistrationFormRouter({
  type,
  step,
  onContinueToPayment,
}: {
  type: RegistrationType;
  step: number;
  onContinueToPayment: () => void;
}) {
  const paid = requiresPaymentStep(type);
  const visibilityClass = paid
    ? step === 2
      ? "[&_.registration-payment]:hidden [&_button[type=submit]]:hidden"
      : "[&_.registration-details]:hidden"
    : "";

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
            requiresPayment
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
            requiresPayment
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className={visibilityClass}>
      {form}
      {paid && step === 2 && (
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
  return (
    <RegistrationFlowProvider>
      <RegistrationHubInner />
    </RegistrationFlowProvider>
  );
}

function RegistrationHubInner() {
  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] =
    useState<RegistrationType>("Delegate Registration");
  const flow = useRegistrationFlow();

  const paidFlow = useMemo(
    () => requiresPaymentStep(registrationType),
    [registrationType]
  );
  const totalSteps = paidFlow ? 3 : 2;

  useEffect(() => {
    const meta = loadMeta();
    if (meta?.registrationType && !isExternalRedirectType(meta.registrationType)) {
      setRegistrationType(meta.registrationType);
      if (meta.step >= 2) {
        const maxStep = requiresPaymentStep(meta.registrationType) ? 3 : 2;
        setStep(Math.min(meta.step, maxStep));
      }
    }
  }, []);

  useEffect(() => {
    if (step > 1 && !isExternalRedirectType(registrationType)) {
      saveMeta({
        step,
        registrationType,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [step, registrationType]);

  const goToPayment = async () => {
    const ok = (await flow?.requestPaymentStep()) ?? true;
    if (!ok) return;
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
        totalSteps={totalSteps}
      >
        <RegistrationProgress
          currentStep={step}
          requiresPayment={paidFlow}
        />
        <RegistrationTrustBar />

        {step === 1 && (
          <CategoryStep
            value={registrationType}
            onChange={(t) => {
              if (!isExternalRedirectType(t)) {
                setRegistrationType(t);
                setStep(1);
              }
            }}
            onContinue={() => {
              if (isExternalRedirectType(registrationType)) return;
              trackEvent(ANALYTICS_EVENTS.registrationStarted, {
                registrationType,
                step: 2,
              });
              setStep(2);
            }}
          />
        )}

        {step >= 2 && !isExternalRedirectType(registrationType) && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span>
                <strong className="text-brand-navy">{registrationType}</strong>
                {paidFlow ? (
                  <span className="ml-2 text-xs text-amber-700">(Paid registration)</span>
                ) : (
                  <span className="ml-2 text-xs text-emerald-700">(Free registration)</span>
                )}
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
                {paidFlow
                  ? "Fill your details below. Progress is saved automatically if you leave this page."
                  : "Complete your details and submit — no payment required for this category."}
              </p>
            )}
            {paidFlow && step === 3 && (
              <p className="text-sm text-slate-600">
                Complete payment and submit your registration.
              </p>
            )}

            {(step === 2 || (paidFlow && step === 3)) && (
              <RegistrationFormRouter
                type={registrationType}
                step={step}
                onContinueToPayment={goToPayment}
              />
            )}

            {paidFlow && step === 3 && (
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
