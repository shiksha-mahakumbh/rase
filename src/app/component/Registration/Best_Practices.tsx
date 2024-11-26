import { ChangeEvent } from "react";
import { FormData, BestPracticesFormProps } from "../Types";

const BestPracticesForm = ({
  formData,
  handleInputChange,
  handleImageChange,
  imageUrl,
}: BestPracticesFormProps) => {
  return (
    <>
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

export default BestPracticesForm;
