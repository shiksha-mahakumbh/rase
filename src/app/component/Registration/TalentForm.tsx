"use client";
import { ChangeEvent, useState } from "react";
import { TalentFormProps } from "../Types";

const TalentForm = ({
  formData,
  handleInputChange,
  handleImageChange,
  imageUrl,
}: TalentFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataForSubmission = new FormData();
      formDataForSubmission.append("name", formData.name);
      formDataForSubmission.append("talentName", formData.talentName);
      formDataForSubmission.append("institutionName", formData.institutionName);
      formDataForSubmission.append("talentType", formData.talentType);
      formDataForSubmission.append("email", formData.email);
      formDataForSubmission.append("contactNumber", formData.contactNumber);
      formDataForSubmission.append("description", formData.description);
      if (imageUrl) {
        formDataForSubmission.append("attachment", imageUrl);
      }

      const response = await fetch("/api/talent", {
        method: "POST",
        body: formDataForSubmission,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Talent submitted successfully!");
        // Reset the form by calling handleInputChange with an empty string
        handleInputChange({
          target: { name: "name", value: "" },
        } as ChangeEvent<HTMLInputElement>); // Type assertion
        // You can reset all other form fields here as well
      } else {
        alert(data.message || "An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error("Error submitting talent form:", error);
      alert("An error occurred while submitting the form.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Talent Name:
          <input
            type="text"
            name="talentName"
            value={formData.talentName}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution Name:
          <input
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Category:
          <select
            name="talentType"
            value={formData.talentType}
            onChange={handleInputChange}
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Talent Type</option>
            <option value="musician">Student</option>
            <option value="dancer">Principal</option>
            <option value="singer">Teacher</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Contact Number:
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Upload Attachments:
          <input
            type="file"
            accept=".pdf, .png, .jpg"
            required
            onChange={handleImageChange}
            className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
          />
        </label>
      </div>

      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </>
  );
};

export default TalentForm;
