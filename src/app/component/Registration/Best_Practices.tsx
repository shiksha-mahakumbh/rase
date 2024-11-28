import { ChangeEvent, useState } from "react";
import { BestPracticesFormProps } from "../Types"; // Assuming types are already defined

const BestPracticesForm = ({
  formData,
  handleInputChange,
  handleImageChange,
  imageUrl,
}: BestPracticesFormProps) => {
  const [attachment, setAttachment] = useState<string | null>(null);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAttachment(base64String); // Set the file to the state as base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = {
      institutionName: formData.institutionName,
      aboutPractices: formData.aboutPractices,
      keyPerson: formData.keyPerson,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.address,
      attachment: attachment, // Sending the base64 file data
    };

    try {
      const response = await fetch("/api/bestPractices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      const data = await response.json();
      if (data.success) {
        alert("Best practice submitted successfully!");
      } else {
        alert("Error submitting form: " + data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error submitting form: " + error.message);
      } else {
        alert("An unknown error occurred");
      }
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
            value={formData?.institutionName || ""}
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
            value={formData?.aboutPractices || ""}
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
            value={formData?.keyPerson || ""}
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
            value={formData?.email || ""}
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
            value={formData?.contactNumber || ""}
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
            value={formData?.address || ""}
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

      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />}

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BestPracticesForm;
