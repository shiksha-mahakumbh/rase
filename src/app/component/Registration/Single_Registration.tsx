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
          <p className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-6 rounded-lg shadow-lg">
            🚧 Coming Soon! Stay tuned for exciting updates on Shiksha Mahakumbh 3.0! 🚀
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-3xl transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-gradient mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Event Registration
        </h1>

        {/* Event Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-semibold text-lg">
            Select Event
          </label>
          <select
            value={event}
            onChange={handleEventChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-purple-300 focus:border-purple-500 shadow-sm transition duration-200"
          >
            <option value="ShikshaMahakumbh2">Shiksha Mahakumbh 3.0</option>
            {/* <option value="ShikshaMahakumbh3">Shiksha Mahakumbh 3.0</option> */}
          </select>
        </div>

        {/* Subcategory Dropdown for Shiksha Mahakumbh 2.0 */}
        {event === "ShikshaMahakumbh2" && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold text-lg">
              Select Registration Type
            </label>
            <select
              value={subcategory}
              onChange={handleSubcategoryChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-purple-300 focus:border-purple-500 shadow-sm transition duration-200"
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
        <div className="mt-6">
          {renderForm()}
        </div>

        <Toaster />
      </div>
    </div>
  );
};

export default RegistrationPage;
