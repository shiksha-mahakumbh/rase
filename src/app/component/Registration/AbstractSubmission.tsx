"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

interface AbstractFormData {
  PaperTitle: string;
  CorrespondingAuthorEmail: string;
  CorrespondingAuthorName: string;
  CoauthorNames?: string;
  CoauthorEmail?: string;
  Keywords: string;
  ContactNumber: string;
  AttachmentsWord: File | null;
  AttachmentsPdf: File | null;
  FeeReceipt: File | null;
  type: string;
}

const AbstractSubmission = () => {
  const initialFormData: AbstractFormData = {
    PaperTitle: "",
    CorrespondingAuthorEmail: "",
    CorrespondingAuthorName: "",
    Keywords: "",
    ContactNumber: "",
    AttachmentsWord: null,
    AttachmentsPdf: null,
    FeeReceipt: null,
    type: "",
    CoauthorNames: "", // Optional field with default value
    CoauthorEmail: "", // Optional field with default value
  };

  const [formData, setFormData] = useState<AbstractFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE_WORD = 200 * 1024; // 200 KB
  const MAX_FILE_SIZE_PDF = 1 * 1024 * 1024; // 1 MB
  const MAX_FILE_SIZE_RECEIPT = 5 * 1024 * 1024; // 5 MB

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.PaperTitle?.trim() &&
      formData.CorrespondingAuthorEmail?.trim() &&
      formData.CorrespondingAuthorName?.trim() &&
      formData.Keywords?.trim() &&
      formData.ContactNumber?.trim() &&
      formData.AttachmentsWord !== null &&
      formData.AttachmentsPdf !== null &&
      formData.FeeReceipt !== null &&
      formData.type?.trim()
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof AbstractFormData,
    maxSize: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error(`File size exceeds the limit of ${maxSize / (1024 * 1024)} MB.`);
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        [field]: file,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log('Form data before submission:', formData); // Debugging step

    setLoading(true);

    if (!isFormValid()) {
      toast.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("PaperTitle", formData.PaperTitle);
      formDataToSubmit.append("CorrespondingAuthorEmail", formData.CorrespondingAuthorEmail);
      formDataToSubmit.append("CorrespondingAuthorName", formData.CorrespondingAuthorName);
      formDataToSubmit.append("Keywords", formData.Keywords);
      formDataToSubmit.append("ContactNumber", formData.ContactNumber);
      formDataToSubmit.append("type", formData.type);

      if (formData.CoauthorNames) formDataToSubmit.append("CoauthorNames", formData.CoauthorNames);
      if (formData.CoauthorEmail) formDataToSubmit.append("CoauthorEmail", formData.CoauthorEmail);

      if (formData.AttachmentsWord) formDataToSubmit.append("AttachmentsWord", formData.AttachmentsWord);
      if (formData.AttachmentsPdf) formDataToSubmit.append("AttachmentsPdf", formData.AttachmentsPdf);
      if (formData.FeeReceipt) formDataToSubmit.append("FeeReceipt", formData.FeeReceipt);

      const response = await fetch("http://localhost:5000/AbstractSubmission", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Submission failed!");
      }

      setLoading(false);
      setFormData(initialFormData); // Reset form after successful submission
      toast.success("Abstract submitted successfully!");
    } catch (error) {
      console.error("Error submitting abstract:", error);
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-white mb-5">
      <div className="shadow-md rounded-md md:w-1/0 mx-auto pt-8 bg-white text-black">
        <h1 className="text-primary text-center text-xl">Paper Submission Form</h1>
        <form onSubmit={handleSubmit} className="bg-white p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Corresponding Author Name <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="text"
              name="CorrespondingAuthorName"
              placeholder="*Your full name*"
              value={formData.CorrespondingAuthorName}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Corresponding Author Email<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="email"
              name="CorrespondingAuthorEmail"
              value={formData.CorrespondingAuthorEmail}
              placeholder="*your@example.com*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Paper Title<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="text"
              name="PaperTitle"
              value={formData.PaperTitle}
              placeholder="*Title*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;Word&#41; <span className="text-red-600 text-xs">(Max size: 200 KB)</span>
              <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="file"
              name="AttachmentsWord"
              accept=".doc, .docx"
              onChange={(e) => handleFileChange(e, "AttachmentsWord", MAX_FILE_SIZE_WORD)}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;PDF&#41; <span className="text-red-600 text-xs">(Max size: 1 MB)</span>
              <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="file"
              name="AttachmentsPdf"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "AttachmentsPdf", MAX_FILE_SIZE_PDF)}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Co&#45;Author Names
            </label>
            <input
              type="text"
              name="CoauthorNames"
              value={formData.CoauthorNames}
              placeholder="*Co-author names*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Co&#45;Author Email
            </label>
            <input
              type="email"
              name="CoauthorEmail"
              value={formData.CoauthorEmail}
              placeholder="*Co-author email*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Keywords <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="text"
              name="Keywords"
              value={formData.Keywords}
              placeholder="*Keywords*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Contact Number <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="text"
              name="ContactNumber"
              value={formData.ContactNumber}
              placeholder="*Your contact number*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Payment Receipt <span className="text-red-600 text-xs">(Max size: 5 MB)</span>
              <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <input
              type="file"
              name="FeeReceipt"
              accept=".jpg, .png, .pdf"
              onChange={(e) => handleFileChange(e, "FeeReceipt", MAX_FILE_SIZE_RECEIPT)}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Type of Paper <span className="text-red-700 text-base"><sup>&#42;</sup></span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
            >
              <option value="">Select Paper Type</option>
              <option value="Research">Research</option>
              <option value="Review">Review</option>
              <option value="Short Paper">Short Paper</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 mt-4 rounded-md bg-primary text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Abstract"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AbstractSubmission;
