import { useState, ChangeEvent } from "react";
import { FormData, DelegateFormProps } from "../Types";

const DelegateForm = ({ formData, handleInputChange, handleRole, handlevb, handleImageChange, imageUrl }: DelegateFormProps) => {
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
          Delegate Type:
          <select
            name="vb"
            value={formData.vb}
            onChange={handlevb}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Type</option>
            <option value="vb">Vidya Bharti</option>
            <option value="nvb">Non Vidya Bharti</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Delegate Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleRole}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Role</option>
            <option value="DelegatesFromIndustry">Delegates from Industry</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principle">Principle</option>
            <option value="dirVcCP">Director/VC/Chairperson</option>
            <option value="ResearchScholar">Research scholar</option>
          </select>
        </label>
      </div>

      {formData.feeAmount !== 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-black">
            <b>Fees: {formData.feeAmount}</b>
          </label>
        </div>
      )}

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

export default DelegateForm;
