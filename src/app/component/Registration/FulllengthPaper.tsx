"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { submitLegacyForm } from "@/lib/legacyFormSubmit";
import toast from "react-hot-toast";

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
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});

  const MAX_WORD_SIZE = 50 * 1024; // 50 KB
  const MAX_PDF_SIZE = 1 * 1024 * 1024; // 1 MB

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.PaperTitle &&
      formData.CorrespondingAuthorEmail &&
      formData.CorrespondingAuthorName &&
      formData.Keywords &&
      formData.ContactNumber &&
      formData.AttachmentsWord &&
      formData.AttachmentsPdf &&
      formData.AttachmentsPpt &&
      pendingFiles.AttachmentsWord &&
      pendingFiles.AttachmentsPdf &&
      pendingFiles.AttachmentsPpt
    );
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
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
      setPendingFiles((prev) => ({ ...prev, [field]: file }));
      setFormData((prevData) => ({
        ...prevData,
        [field]: file.name,
      }));
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
      await submitLegacyForm({
        registrationType: "Paper Submission",
        data: {
          fullName: formData.CorrespondingAuthorName,
          email: formData.CorrespondingAuthorEmail,
          contactNumber: formData.ContactNumber,
          institution: formData.CorrespondingAuthorName,
          ...formData,
        },
        files: ["AttachmentsWord", "AttachmentsPdf", "AttachmentsPpt", "FeeReceipt"]
          .filter((field) => pendingFiles[field])
          .map((field) => ({
            file: pendingFiles[field],
            field,
            folder: "papers",
          })),
      });
      setFormData(initialFormData);
      setPendingFiles({});
      toast.success(
        "Congratulations you have successfully submitted the Full length paper!"
      );
    } catch (error) {
      console.error("Error submitting paper:", error);
      toast.error("Something broke while submitting the Full Length Paper!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mb-5 px-4">
      <div className="shadow-md rounded-md max-w-screen-md mx-auto pt-8 bg-white text-black">
        <h1 className="text-primary text-center text-2xl mb-4">
          Full Length Paper Submission Form
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-4">
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
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
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
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
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
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Full-Length Paper &#40;Word&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup> (Max 50KB)
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsWord"
              accept=".doc, .docx"
              onChange={(e) => handleFileChange(e, "AttachmentsWord")}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Full-Length Paper &#40;PDF&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup> (Max 1MB)
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsPdf"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "AttachmentsPdf")}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Full-Length Paper &#40;PPT&#41;
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="file"
              name="AttachmentsPpt"
              accept=".ppt, .pptx"
              onChange={(e) => handleFileChange(e, "AttachmentsPpt")}
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
              placeholder="*coauthor@example.com*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
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
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
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
              type="tel"
              name="ContactNumber"
              placeholder="*1234567890*"
              value={formData.ContactNumber}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Payment Receipt
              <span className="text-red-700 text-base">
                <sup>&#42;</sup>
              </span>
            </label>
            <input
              type="file"
              name="FeeReceipt"
              accept=".pdf, .png, .jpg"
              onChange={(e) => handleFileChange(e, "FeeReceipt")}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>
          <div className="text-sm text-red-600 mb-4">
            Note&#58; Please ensure to attach the fee receipt which you have
            paid during abstract submission&#59; failure to do so will render
            the full-length paper ineligible for consideration.
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-color transition duration-300 mt-4 w-full"
            disabled={loading}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Fulllengthpaper;
