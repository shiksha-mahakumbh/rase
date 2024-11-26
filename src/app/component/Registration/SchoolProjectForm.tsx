"use client";
import React, { useState } from "react";
import axios from "axios"; // Assuming API calls are made to your server
import { toast } from "react-hot-toast";

const SchoolProjectForm: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [participants, setParticipants] = useState<
    { name: string; phone: string; email: string; class: string }[]
  >([{ name: "", phone: "", email: "", class: "" }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    schoolName: "",
    schoolAddress: "",
    projectPpt: null as File | null,
    projectVideo: null as File | null,
    feeUpload: null as File | null,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setTeamSize(size);
    setParticipants(Array(size).fill({ name: "", phone: "", email: "", class: "" }));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    setParticipants(updatedParticipants);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.projectName ||
        !formData.projectDescription ||
        !formData.schoolName ||
        !formData.schoolAddress ||
        !formData.projectPpt ||
        !formData.projectVideo ||
        !formData.feeUpload
      ) {
        toast.error("All fields are required.");
        setLoading(false);
        return;
      }

      const formDataForSubmission = new FormData();
      formDataForSubmission.append("projectName", formData.projectName);
      formDataForSubmission.append("projectDescription", formData.projectDescription);
      formDataForSubmission.append("schoolName", formData.schoolName);
      formDataForSubmission.append("schoolAddress", formData.schoolAddress);
      formDataForSubmission.append("teamSize", String(teamSize));
      formDataForSubmission.append("participants", JSON.stringify(participants));
      formDataForSubmission.append("projectPpt", formData.projectPpt!);
      formDataForSubmission.append("projectVideo", formData.projectVideo!);
      formDataForSubmission.append("feeUpload", formData.feeUpload!);

      // Assuming API endpoint that handles form submission and MySQL database storage
      const response = await axios.post("http://localhost:5000/api/schoolProject", formDataForSubmission, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Project submitted successfully!");
      setFormData({
        projectName: "",
        projectDescription: "",
        schoolName: "",
        schoolAddress: "",
        projectPpt: null,
        projectVideo: null,
        feeUpload: null,
      });
      setParticipants([{ name: "", phone: "", email: "", class: "" }]);
      setTeamSize(0);
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
      answer: "Yes, using third-party libraries is allowed as long as they do not violate any competition rules.",
    },
    {
      question: "Where can we get more information?",
      answer: "You can contact us via email for more information.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">
        Project Display Registration for School
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Project Description</label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* School Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">School Name</label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* School Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">School Address</label>
          <textarea
            name="schoolAddress"
            value={formData.schoolAddress}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Team Size</label>
          <select
            name="teamSize"
            value={teamSize}
            onChange={handleTeamSizeChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="0">Select Team Size</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        {/* File Upload Fields */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">Project PPT</label>
          <input
            type="file"
            name="projectPpt"
            onChange={handleFileChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Project Video</label>
          <input
            type="file"
            name="projectVideo"
            onChange={handleFileChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Fee Upload</label>
          <input
            type="file"
            name="feeUpload"
            onChange={handleFileChange}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-gradient-to-l focus:ring focus:ring-offset-1 focus:ring-indigo-600 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* FAQ Section */}
      <div className="mt-8 bg-black p-6 rounded-md shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-white mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center py-3 px-4 text-left text-white font-semibold focus:outline-none"
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && <div className="px-4 py-2 text-primary">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolProjectForm;
