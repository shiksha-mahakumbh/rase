"use client";
import { useState, ChangeEvent } from "react";
import DelegateForm from "./DelegateForm";
import ProjectDisplaySubmission from "./ProjectDisplaySubmission";
import TalentForm from "./TalentForm";
import VolunteerForm from "./VolunteerForm";
import NGOForm from "./NGOForm";
import ConclaveForm from "./ConclaveForm";
import AbstractSubmissionForm from "./AbstractSubmission";
import FullLengthPaperForm from "./FulllengthPaper";
import OrganizerRegForm from "./OrganizerReg";
import AccomodationForm from "./AccomodationReg";
import BestPracticesForm from "./Best_Practices";
import { Toaster } from "react-hot-toast";
import RegistrationShell from "../ui/RegistrationShell";
import { formClasses } from "../ui/formClasses";

const RegistrationPage = () => {
  const [event, setEvent] = useState<string>("ShikshaMahakumbh2");
  const [subcategory, setSubcategory] = useState<string>("");

  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEvent(e.target.value);
    setSubcategory(""); // Reset subcategory when event changes
  };

  const handleSubcategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSubcategory(e.target.value);
  };

  const renderForm = () => {
    if (event === "ShikshaMahakumbh3") {
      return (
        <div className="text-center text-lg text-gray-700 mt-4">
          <p className={formClasses.comingSoon}>
            🚧 Coming Soon! Stay tuned for exciting updates on Shiksha Mahakumbh 2026! 🚀
          </p>
        </div>
      );
    }

    switch (subcategory) {
      case "delegate":
        return <DelegateForm />;
      case "institution":
        return <ProjectDisplaySubmission />;
      case "talent":
        return <TalentForm />;
      case "volunteer":
        return <VolunteerForm />;
      case "ngo":
        return <NGOForm />;
      case "conclave":
        return <ConclaveForm />;
      case "Abstract":
        return <AbstractSubmissionForm />;
      case "FullLengthPaper":
        return <FullLengthPaperForm />;
      case "BestPractices":
        return <BestPracticesForm />;
      case "OrganizerReg":
        return <OrganizerRegForm />;
      case "Accomodation":
        return <AccomodationForm />;
      default:
        return (
          <div className="text-center text-gray-500">Please select a registration type to proceed.</div>
        );
    }
  };

  const subcategories = {
    ShikshaMahakumbh2: [
      { value: "delegate", label: "Delegate" },
      { value: "institution", label: "Project Display" },
      { value: "talent", label: "Talent" },
      { value: "volunteer", label: "Volunteer" },
      { value: "ngo", label: "NGO" },
      { value: "conclave", label: "Conclave" },
      { value: "Abstract", label: "Submit Abstract" },
      { value: "FullLengthPaper", label: "Submit Full-Length Paper" },
      { value: "BestPractices", label: "Best Practices" },
      { value: "OrganizerReg", label: "Organizer" },
      { value: "Accomodation", label: "Accommodation" },
    ],
  };

  const step = subcategory ? 2 : event ? 1 : 0;

  return (
    <RegistrationShell
      title="Event Registration"
      step={step || 1}
      totalSteps={2}
    >
      {/* Event Selection */}
      <div className="mb-6">
        <label className={`${formClasses.label} text-lg`}>
          Select Event
        </label>
        <select
          value={event}
          onChange={handleEventChange}
          className={formClasses.select}
        >
          <option value="ShikshaMahakumbh2">Shiksha Mahakumbh 2025</option>
          { <option value="ShikshaMahakumbh3">Shiksha Mahakumbh 2026</option> }
        </select>
      </div>

      {/* Subcategory Dropdown for Shiksha Mahakumbh 2.0 */}
      {event === "ShikshaMahakumbh2" && (
        <div className="mb-6">
          <label className={`${formClasses.label} text-lg`}>
            Select Registration Type
          </label>
          <select
            value={subcategory}
            onChange={handleSubcategoryChange}
            className={formClasses.select}
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            {subcategories[event]?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render the selected form or message */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        {renderForm()}
      </div>

      <Toaster />
    </RegistrationShell>
  );
};

export default RegistrationPage;
