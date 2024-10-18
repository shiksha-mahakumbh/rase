import { useState, ChangeEvent } from "react";
import { FormData, InstitutionFormProps } from "../Types";

const InstitutionForm = ({ formData, handleInputChange, handleRole, handleImageChange, imageUrl }: InstitutionFormProps) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution Name:
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
          Institution Type:
          <select
            name="role"
            value={formData.role}
            onChange={handleRole}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Type</option>
            <option value="Academica">Academia</option>
            <option value="Industry">Industry</option>
            <option value="NGO">NGO/Society/Trust</option>
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
          Website:
          <input
            type="text"
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
          Contribution:
          <input
            type="text"
            name="cont"
            value={formData.cont}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      {formData.feeAmount !== 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 ">
            Upload Fee Receipt:
            <input
              type="file"
              accept=".pdf, .png, .jpg"
              required={formData.feeAmount !== 0}
              onChange={handleImageChange}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
            />
          </label>
        </div>
      )}

      {imageUrl && (
        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
      )}
    </>
  );
};

export default InstitutionForm;
