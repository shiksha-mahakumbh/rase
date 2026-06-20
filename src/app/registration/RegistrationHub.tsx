"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import RegistrationShell from "@/components/registration/RegistrationShell";
import { EVENT_NAME, RegistrationType } from "@/types/registration";
import DelegateForm from "@/components/forms/DelegateForm";
import ConclaveForm from "@/components/forms/ConclaveForm";
import BestPracticeForm from "@/components/forms/BestPracticeForm";
import OlympiadForm from "@/components/forms/OlympiadForm";
import AwardsForm from "@/components/forms/AwardsForm";
import GenericRegistrationForm from "@/components/forms/GenericRegistrationForm";
import RegistrationProgress from "@/components/registration/RegistrationProgress";
import CategoryStep from "@/components/registration/CategoryStep";
import CategoryInstructionsPanel from "@/components/registration/CategoryInstructionsPanel";
import { loadMeta, saveMeta, switchRegistrationCategory, clearRegistrationMeta, clearDraft } from "@/lib/registration/draftStorage";
import RecaptchaScript from "@/components/security/RecaptchaProvider";
import { RegistrationFlowProvider } from "@/components/registration/RegistrationFlowContext";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import RegistrationTrustBar from "@/components/registration/RegistrationTrustBar";
import {
  isExternalRedirectType,
  usesMultiStepPaymentFlow,
} from "@/lib/registration/config";
import { useRegistrationFlow } from "@/components/registration/RegistrationFlowContext";
import { loadRazorpayCheckoutScript } from "@/lib/razorpay/load-checkout-script";

const MemoDelegateForm = memo(DelegateForm);
const MemoConclaveForm = memo(ConclaveForm);
const MemoBestPracticeForm = memo(BestPracticeForm);
const MemoOlympiadForm = memo(OlympiadForm);
const MemoAwardsForm = memo(AwardsForm);
const MemoGenericForm = memo(GenericRegistrationForm);

function RegistrationFormRouter({
  type,
  step,
  onContinueToPayment,
  showPaymentStep,
}: {
  type: RegistrationType;
  step: number;
  onContinueToPayment: () => void;
  showPaymentStep: boolean;
}) {
  const visibilityClass = showPaymentStep
    ? step === 2
      ? "[&_.registration-payment]:hidden [&_button[type=submit]]:hidden"
      : step === 3
        ? "[&_.registration-details]:hidden"
        : "[&_.registration-details]:hidden [&_.registration-payment]:hidden"
    : "";

  const form = useMemo(() => {
    switch (type) {
      case "Delegate Registration":
        return <MemoDelegateForm />;
      case "Conclave":
        return <MemoConclaveForm />;
      case "Best Practices":
        return <MemoBestPracticeForm />;
      case "Olympiad":
        return <MemoOlympiadForm />;
      case "Awards":
        return <MemoAwardsForm />;
      case "Exhibition":
        return (
          <MemoGenericForm
            registrationType="Exhibition"
            sectionTitle="Exhibition Registration"
          />
        );
      case "Projects":
        return (
          <MemoGenericForm
            registrationType="Projects"
            sectionTitle="Projects Registration"
            requiresPayment
          />
        );
      case "Bal Shodh Patrika":
        return (
          <MemoGenericForm
            registrationType="Bal Shodh Patrika"
            sectionTitle="Bal Shodh Patrika Registration"
          />
        );
      case "Cultural Program":
        return (
          <MemoGenericForm
            registrationType="Cultural Program"
            sectionTitle="Cultural Program Registration"
          />
        );
      case "Accommodation":
        return (
          <MemoGenericForm
            registrationType="Accommodation"
            sectionTitle="Accommodation Registration"
            requiresPayment
          />
        );
      default:
        return null;
    }
  }, [type]);

  return (
    <div className={visibilityClass}>
      {form}
      {showPaymentStep && step === 2 && (
        <button
          type="button"
          onClick={onContinueToPayment}
          className="mt-4 w-full min-h-[48px] rounded-xl bg-brand-saffron font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
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
  const currentFee = flow?.currentFee ?? 0;
  const metaLoadedRef = useRef(false);

  const showPaymentStep = usesMultiStepPaymentFlow(registrationType, currentFee);
  const totalSteps = showPaymentStep ? 3 : 2;

  useEffect(() => {
    if (!flow) return;
    return flow.registerPaymentVerifiedHandler(() => {
      setStep(3);
      saveMeta({
        step: 3,
        registrationType,
        updatedAt: new Date().toISOString(),
      });
      window.scrollTo(0, 0);
    });
  }, [flow, registrationType]);

  useEffect(() => {
    if (metaLoadedRef.current) return;
    metaLoadedRef.current = true;
    const meta = loadMeta();
    if (meta?.registrationType && !isExternalRedirectType(meta.registrationType)) {
      setRegistrationType(meta.registrationType);
      if (meta.step >= 2) {
        const maxStep = usesMultiStepPaymentFlow(meta.registrationType, currentFee)
          ? 3
          : 2;
        setStep(Math.min(meta.step, maxStep));
      }
    }
  }, [currentFee]);

  useEffect(() => {
    if (step > 1 && !isExternalRedirectType(registrationType)) {
      saveMeta({
        step,
        registrationType,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [step, registrationType]);

  useEffect(() => {
    if (!showPaymentStep && step === 3) {
      setStep(2);
    }
  }, [showPaymentStep, step]);

  useEffect(() => {
    if (!showPaymentStep) return;
    void loadRazorpayCheckoutScript().catch((err) => {
      console.error("RAZORPAY_SCRIPT_LOAD_FAILED", {
        phase: "hub_preload",
        error: err instanceof Error ? err.message : String(err),
      });
    });
  }, [showPaymentStep]);

  const goToPayment = useCallback(async () => {
    const ok = (await flow?.requestPaymentStep()) ?? true;
    if (!ok) return;
    setStep(3);
    window.scrollTo(0, 0);
  }, [flow]);

  return (
    <>
      <RecaptchaScript />
      <Toaster position="top-center" />
      <RegistrationShell
        title={EVENT_NAME}
        subtitle="Official registration — national education movement & global summit"
        step={step}
        totalSteps={totalSteps}
        sidebar={
          step >= 2 && !isExternalRedirectType(registrationType) ? (
            <CategoryInstructionsPanel registrationType={registrationType} />
          ) : undefined
        }
      >
        <RegistrationProgress
          currentStep={step}
          requiresPayment={showPaymentStep}
        />
        <RegistrationTrustBar />

        {step === 1 && (
          <CategoryStep
            value={registrationType}
            onChange={(t) => {
              if (!isExternalRedirectType(t)) {
                if (t !== registrationType) {
                  clearDraft(registrationType);
                }
                setRegistrationType(t);
                setStep(1);
                flow?.setCurrentFee(0);
                switchRegistrationCategory(t);
                console.info("CATEGORY_SELECTED", { registrationType: t });
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
                {showPaymentStep ? (
                  <span className="ml-2 text-xs text-amber-700">(Paid registration)</span>
                ) : (
                  <span className="ml-2 text-xs text-emerald-700">(Free registration)</span>
                )}
              </span>
              <button
                type="button"
                className="font-semibold text-brand-saffron underline"
                onClick={() => {
                  clearDraft(registrationType);
                  clearRegistrationMeta();
                  setRegistrationType("Delegate Registration");
                  setStep(1);
                  flow?.setCurrentFee(0);
                }}
              >
                Change category
              </button>
            </div>

            {step === 2 && (
              <p className="text-sm text-slate-600">
                {showPaymentStep
                  ? "Fill your details below. Progress is saved automatically if you leave this page."
                  : "Complete your details and submit — no payment required for this category."}
              </p>
            )}
            {showPaymentStep && step === 3 && (
              <p className="text-sm text-slate-600">
                Complete payment and submit your registration.
              </p>
            )}

            <RegistrationFormRouter
              key={registrationType}
              type={registrationType}
              step={step}
              onContinueToPayment={goToPayment}
              showPaymentStep={showPaymentStep}
            />

            {showPaymentStep && step === 3 && (
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
