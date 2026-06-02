"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import RegistrationShell from "@/app/component/ui/RegistrationShell";
import { formClasses } from "@/app/component/ui/formClasses";
import {
  EVENT_NAME,
  REGISTRATION_TYPE_OPTIONS,
  RegistrationType,
} from "@/types/registration";
import DelegateForm from "@/components/forms/DelegateForm";
import ConclaveForm from "@/components/forms/ConclaveForm";
import BestPracticeForm from "@/components/forms/BestPracticeForm";
import OlympiadForm from "@/components/forms/OlympiadForm";
import AwardsForm from "@/components/forms/AwardsForm";
import GenericRegistrationForm from "@/components/forms/GenericRegistrationForm";

function RegistrationFormRouter({ type }: { type: RegistrationType }) {
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
}

export default function RegistrationHub() {
  const [registrationType, setRegistrationType] = useState<RegistrationType>(
    "Delegate Registration"
  );

  return (
    <>
      <Toaster position="top-center" />
      <RegistrationShell
        title={EVENT_NAME}
        subtitle="Official registration portal — select your registration type and complete the form"
      >
        <div className="mb-8 rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 to-amber-50/40 p-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Event Name
          </p>
          <p className="text-xl font-bold text-gray-900">{EVENT_NAME}</p>

          <div className={`${formClasses.fieldGroup} mt-4`}>
            <label htmlFor="registrationType" className={formClasses.label}>
              Registration Type <span className={formClasses.required}>*</span>
            </label>
            <select
              id="registrationType"
              className={formClasses.select}
              value={registrationType}
              onChange={(e) =>
                setRegistrationType(e.target.value as RegistrationType)
              }
            >
              {REGISTRATION_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <RegistrationFormRouter type={registrationType} />
      </RegistrationShell>
    </>
  );
}
