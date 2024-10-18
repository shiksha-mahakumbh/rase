import { ChangeEvent } from "react";
import { FormData, NGOFormProps } from "../Types";

const NGOForm = ({ formData, handleInputChange, handleImageChange, imageUrl }: NGOFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          NGO Name:
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
          Registration Number:
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
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
          Website:
          <input
            type="url"
            name="website"
            value={formData.website}
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
          Contribution:
          <textarea
            name="contribution"
            value={formData.contribution}
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
    </>
  );
};

export default NGOForm;
