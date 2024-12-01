import { ChangeEvent, useState } from "react";

const BestPracticesForm = () => {
  const [formData, setFormData] = useState({
    institutionName: "",
    aboutPractices: "",
    keyPerson: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [attachment, setAttachment] = useState<File | null>(null); // Store file directly

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file); // Store file directly
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formDataForSubmission = new FormData();
    formDataForSubmission.append("institutionName", formData.institutionName);
    formDataForSubmission.append("aboutPractices", formData.aboutPractices);
    formDataForSubmission.append("keyPerson", formData.keyPerson);
    formDataForSubmission.append("email", formData.email);
    formDataForSubmission.append("contactNumber", formData.contactNumber);
    formDataForSubmission.append("address", formData.address);
  
    if (attachment) {
      formDataForSubmission.append("attachment", attachment); // Append the file directly
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/best-practices", {
        method: "POST",
        body: formDataForSubmission,
      });
  
      // Check if response is ok (status 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Try to parse the response as JSON
      const data = await response.json();
  
      // Check if the expected data format is returned
      if (data && data.success) {
        alert("Best practice submitted successfully!");
      } else {
        alert("Submitting form: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      // Improved error handling for both fetch and response parsing
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution/Organization/Ministry/State/NGO Name:
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
          About Practices (250 words):
          <textarea
            name="aboutPractices"
            value={formData.aboutPractices}
            onChange={handleInputChange}
            required
            maxLength={250}
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Key Person:
          <input
            type="text"
            name="keyPerson"
            value={formData.keyPerson}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
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
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Upload Attachments (Optional):
          <input
            type="file"
            accept=".pdf, .png, .jpg"
            onChange={handleFileChange}
            className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
          />
        </label>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BestPracticesForm;
