"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface FullLengthPaperFormDataSM {
  PaperTitle: string;
  CorrespondingAuthorEmail: string;
  CorrespondingAuthorName: string;
  CoauthorNames?: string;
  CoauthorEmail?: string;
  Keywords: string;
  ContactNumber: string;
  AttachmentsWord: string | null;
  AttachmentsPdf: string | null;
  AttachmentsPpt: string | null;
  FeeReceipt: string | null;
}

const Fulllengthpaper = () => {
  const initialFormData: FullLengthPaperFormDataSM = {
    PaperTitle: "",
    CorrespondingAuthorEmail: "",
    CorrespondingAuthorName: "",
    Keywords: "",
    ContactNumber: "",
    AttachmentsWord: null,
    AttachmentsPdf: null,
    AttachmentsPpt: null,
    FeeReceipt: null,
  };

  const [formData, setFormData] = useState<FullLengthPaperFormDataSM>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const MAX_WORD_SIZE = 50 * 1024; // 50 KB
  const MAX_PDF_SIZE = 1 * 1024 * 1024; // 1 MB

  const isFormValid = () => {
    return (
      formData.PaperTitle &&
      formData.CorrespondingAuthorEmail &&
      formData.CorrespondingAuthorName &&
      formData.Keywords &&
      formData.ContactNumber &&
      formData.AttachmentsWord &&
      formData.AttachmentsPdf &&
      formData.AttachmentsPpt
    );
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (
        (field === "AttachmentsWord" && file.size > MAX_WORD_SIZE) ||
        (field === "AttachmentsPdf" && file.size > MAX_PDF_SIZE)
      ) {
        toast.error(
          `File size for ${field === "AttachmentsWord" ? "Word" : "PDF"} file exceeds the limit`
        );
        return;
      }
      try {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        const response = await axios.post("http://localhost:5000/FullPaper", formDataObj, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const fileUrl = response.data.fileUrl;
        setFormData((prevData) => ({
          ...prevData,
          [field]: fileUrl,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
        setError(error);
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isFormValid()) {
      toast.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/submit-paper", formData);
      toast.success(
        "Congratulations! You have successfully submitted the Full Length Paper!"
      );
      setFormData(initialFormData); // reset the form
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error);
      toast.error("Something went wrong while submitting the Full Length Paper!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mb-5 ">
      <div className="shadow-md rounded-md md:w-1/0 mx-auto pt-8 bg-white text-black ">
        <h1 className="text-2xl font-semibold text-primary text-center mb-6">
          Full Length Paper Submission Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Corresponding Author Name
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="text"
              name="CorrespondingAuthorName"
              placeholder="*Your full name*"
              value={formData.CorrespondingAuthorName}
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Corresponding Author Email
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="email"
              name="CorrespondingAuthorEmail"
              value={formData.CorrespondingAuthorEmail}
              placeholder="*your@example.com*"
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Paper Title
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="text"
              name="PaperTitle"
              value={formData.PaperTitle}
              placeholder="*Title*"
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;Word&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup> (Max 50KB)
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsWord"
              accept=".doc, .docx"
              onChange={(e) => handleFileChange(e, "AttachmentsWord")}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;PDF&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup> (Max 1MB)
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsPdf"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "AttachmentsPdf")}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;PPT&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsPpt"
              accept=".ppt, .pptx"
              onChange={(e) => handleFileChange(e, "AttachmentsPpt")}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300"
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
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
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
              placeholder="*coauthor@example.com*"
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Keywords
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="text"
              name="Keywords"
              value={formData.Keywords}
              placeholder="*Keywords*"
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Contact Number
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="text"
              name="ContactNumber"
              value={formData.ContactNumber}
              placeholder="*Contact Number*"
              onChange={handleInputChange}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Fee Receipt
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="file"
              name="FeeReceipt"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "FeeReceipt")}
              className="mt-2 p-3 block w-full rounded-md border border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary-color focus:ring-2 focus:ring-indigo-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Paper"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Fulllengthpaper;
