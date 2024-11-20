import { ChangeEvent } from "react";
import { FormData, TalentFormProps } from "../Types";

const TalentForm = ({ formData, handleInputChange, handleImageChange, imageUrl }: TalentFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Talent Name:
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
          <input
            type="text"
            name="category"
            value={formData.category}
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
      
    </>
    
  );
};

export default TalentForm;
