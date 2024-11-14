"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const HeiProjectForm: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [participants, setParticipants] = useState<
    { name: string; phone: string; email: string; course: string }[]
  >([{ name: "", phone: "", email: "", course: "" }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    instituteName: "",
    instituteAddress: "",
    projectPpt: null as File | null,
    projectVideo: null as File | null,
    feeUpload: null as File | null,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle team size change
  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setTeamSize(size);
    setParticipants(Array(size).fill({ name: "", phone: "", email: "" }));
  };

  // Handle participant changes
  const handleParticipantChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    setParticipants(updatedParticipants);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  // File upload to backend API (MySQL)
  const uploadFile = async (file: File, fieldName: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fieldName", fieldName);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields are filled
      if (
        !formData.projectName ||
        !formData.projectDescription ||
        !formData.instituteName ||
        !formData.instituteAddress ||
        !formData.projectPpt ||
        !formData.projectVideo ||
        !formData.feeUpload
      ) {
        toast.error("All fields are required.");
        setLoading(false);
        return;
      }

      // Upload files to the backend
      const pptUrl = await uploadFile(formData.projectPpt!, "ppt");
      const videoUrl = await uploadFile(formData.projectVideo!, "video");
      const feeUrl = await uploadFile(formData.feeUpload!, "fee");

      // Prepare form data for API submission
      const formDataForAPI = {
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        instituteName: formData.instituteName,
        instituteAddress: formData.instituteAddress,
        teamSize: teamSize,
        participants: participants,
        projectPptUrl: pptUrl,
        projectVideoUrl: videoUrl,
        feeReceiptUrl: feeUrl,
      };

      // Send form data to the backend API
      const response = await fetch("/api/submit-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataForAPI),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form.");
      }

      toast.success("Project submitted successfully!");

      // Reset form data
      setFormData({
        projectName: "",
        projectDescription: "",
        instituteName: "",
        instituteAddress: "",
        projectPpt: null,
        projectVideo: null,
        feeUpload: null,
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Failed to submit the form.");
    }

    setLoading(false);
  };

  const faqData = [
    {
      question: "How many members can be in a team?",
      answer: "Minimum 1 member and maximum 4 members.",
    },
    {
      question: "Is the project working or just an idea?",
      answer: "The project should be in working condition.",
    },
    {
      question: "Are there any prizes?",
      answer: "Yes, there will be prizes for appreciation.",
    },
    {
      question: "What are the submission deadlines?",
      answer: "Submissions must be received by the end of the month.",
    },
    {
      question: "Can we use third-party libraries?",
      answer:
        "Yes, using third-party libraries is allowed as long as they do not violate any competition rules.",
    },
    {
      question: "Where can we get more information?",
      answer: "You can contact us via email for more information.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">
        Project Display Registration for HEI
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Name <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Description{" "}
            <span className="text-red-500">(max 400 words)*</span>
          </label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
            required
          />
        </div>

        {/* File Upload Sections */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project PPT Upload <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="file"
            name="projectPpt"
            onChange={handleFileChange}
            accept=".ppt, .pptx"
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            required
          />
          {loading && formData.projectPpt && (
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          )}
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Select Team Size
          </label>
          <select
            value={teamSize}
            onChange={handleTeamSizeChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={0}>Select Team Size</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>

        {/* Participants */}
        {[...Array(teamSize)].map((_, index) => (
          <div key={index}>
            <h2 className="text-lg font-semibold text-gray-700">Participant {index + 1}</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={participants[index].name}
                onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={participants[index].phone}
                onChange={(e) => handleParticipantChange(index, "phone", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={participants[index].email}
                onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Course"
                value={participants[index].course}
                onChange={(e) => handleParticipantChange(index, "course", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>
        ))}

        {/* FAQ Section */}
        <div>
          {faqData.map((item, index) => (
            <div key={index} className="border-t pt-4">
              <h3
                onClick={() => toggleFAQ(index)}
                className="text-md font-semibold text-gray-700 cursor-pointer"
              >
                {item.question}
              </h3>
              {openIndex === index && (
                <p className="text-gray-600">{item.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeiProjectForm;
