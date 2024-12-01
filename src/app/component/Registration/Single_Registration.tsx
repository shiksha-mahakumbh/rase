"use client";
import { useState, FormEvent, ChangeEvent } from "react";
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

const RegistrationPage = () => {
  const [category, setCategory] = useState<string>("delegate");

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const renderForm = () => {
    switch (category) {
      case "delegate":
        return <DelegateForm />;
      case "institution":
        return <ProjectDisplaySubmission />;
      case "talent":
        return <TalentForm/>;
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
        return <div>Select a registration type to get started.</div>;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Event Registration</h1>

        {/* Form Category Selection */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">Select Registration Type</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="delegate">Delegate</option>
            <option value="institution">Project Display</option>
            <option value="talent">Talent</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
            <option value="conclave">Conclave</option>
            <optgroup label="Submission Type">
              <option value="Abstract">Submit Abstract</option>
              <option value="FullLengthPaper">Submit Full-Length Paper</option>
            </optgroup>
            <option value="BestPractices">Best Practices</option>
            <option value="OrganizerReg">Organizer</option>
            <option value="Accomodation">Accommodation</option>
          </select>
        </div>

        {/* Render the selected form */}
        {renderForm()}

        <Toaster />
      </div>
    </div>
  );
};

export default RegistrationPage;
