"use client";

import { ChangeEvent, useState } from "react";

const TalentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    talentName: "",
    institutionName: "",
    talentType: "",
    email: "",
    contactNumber: "",
    description: "",
   
  });

  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes and FileReader to Base64
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageUrl(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Convert the file to Base64 using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          attachment: base64String, // Store the Base64 string in the form data
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
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

      // Append file if it exists (using base64 or file itself)
      if (imageUrl) {
        formDataForSubmission.append("attachment", imageUrl); // Direct file upload
      }

      // Optionally, use base64-encoded string
      // formDataForSubmission.append("attachment", formData.attachment); // If using Base64

      const response = await fetch("http://localhost:5000/talent", {
        method: "POST",
        body: formDataForSubmission,
      });

      if (!response.ok) {
        const errorData = await response.text(); // Read raw response
        console.error("Error response:", errorData);
        alert(errorData || "An error occurred.");
        return;
      }

      const result = await response.json(); // Parse JSON response
      alert(result.message);
      setFormData({
        name: "",
        talentName: "",
        institutionName: "",
        talentType: "",
        email: "",
        contactNumber: "",
        description: "",
      
      });
      setImageUrl(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error submitting talent form:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field */}
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

      {/* Talent Name Field */}
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

      {/* Institution Name Field */}
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

      {/* Talent Type Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Category:
          <select
            name="talentType"
            value={formData.talentType}
            onChange={handleInputChange}
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            required
          >
            <option value="">Select Talent Type</option>
            <option value="student">Student</option>
            <option value="principal">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      {/* Email Field */}
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

      {/* Contact Number Field */}
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

      {/* Description Field */}
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

      {/* File Upload Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Upload Attachments:
          <input
            type="file"
            name="attachment"
            accept=".pdf, .png, .jpg"
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="mb-4">
          <img src={previewUrl} alt="Preview" className="max-w-full rounded-md" />
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default TalentForm;
