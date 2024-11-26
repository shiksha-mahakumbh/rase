"use client";
import React, { useState } from "react";
import axios from "axios"; // You'll use axios for making HTTP requests
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

      // Create a FormData object to send files and form data to the backend
      const form = new FormData();
      form.append("projectName", formData.projectName);
      form.append("projectDescription", formData.projectDescription);
      form.append("instituteName", formData.instituteName);
      form.append("instituteAddress", formData.instituteAddress);
      form.append("teamSize", teamSize.toString());
      form.append("participants", JSON.stringify(participants));

      // Append the files to FormData
      form.append("projectPpt", formData.projectPpt!);
      form.append("projectVideo", formData.projectVideo!);
      form.append("feeUpload", formData.feeUpload!);

      // Send data to the backend
      const response = await axios.post("http://localhost:5000/api/submitProject", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Project submitted successfully!");
        setFormData({
          projectName: "",
          projectDescription: "",
          instituteName: "",
          instituteAddress: "",
          projectPpt: null,
          projectVideo: null,
          feeUpload: null,
        });
        setParticipants([{ name: "", phone: "", email: "", course: "" }]);
        setTeamSize(0);
      }
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

        {/* File Uploads */}
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Video Upload <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="file"
            name="projectVideo"
            onChange={handleFileChange}
            accept="video/*"
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            required
          />
        </div>

        {/* Institute Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Institute Name <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="text"
            name="instituteName"
            value={formData.instituteName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Institute Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Institute Address <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="text"
            name="instituteAddress"
            value={formData.instituteAddress}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Team Size <span className="text-red-500">&#42;</span>
          </label>
          <select
            value={teamSize}
            onChange={handleTeamSizeChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="0">Select Team Size</option>
            <option value="1">1 Member</option>
            <option value="2">2 Members</option>
            <option value="3">3 Members</option>
            <option value="4">4 Members</option>
          </select>
        </div>

        {/* Participants */}
        {participants.map((_, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg mt-4">Participant {index + 1}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={participants[index].name}
                  onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={participants[index].phone}
                  onChange={(e) => handleParticipantChange(index, "phone", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={participants[index].email}
                  onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Course
                </label>
                <input
                  type="text"
                  value={participants[index].course}
                  onChange={(e) => handleParticipantChange(index, "course", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
};

export default HeiProjectForm;
