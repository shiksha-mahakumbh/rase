"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/app/firebase";
import { collection, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

interface AbstractFormData {
  name: string;
  email: string;
  PaperTitle: string;
  CorrespondingAuthorEmail: string;
  CorrespondingAuthorName: string;
  CoauthorNames?: string;
  CoauthorEmail?: string;
  Keywords: string;
  ContactNumber: string;
  AttachmentsWord: string | null;
  AttachmentsPdf: string | null;
  FeeReceipt: string | null;
  type: string;
}

const AbstractSubmission = () => {
  const initialFormData: AbstractFormData = {
    name: "",
    PaperTitle: "",
    email: "",
    CorrespondingAuthorEmail: "",
    CorrespondingAuthorName: "",
    Keywords: "",
    ContactNumber: "",
    AttachmentsWord: null,
    AttachmentsPdf: null,
    FeeReceipt: null,
    type: "",
  };

  const [formData, setFormData] = useState<AbstractFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.name &&
      formData.PaperTitle &&
      formData.email &&
      formData.CorrespondingAuthorEmail &&
      formData.CorrespondingAuthorName &&
      formData.Keywords &&
      formData.ContactNumber &&
      formData.AttachmentsWord &&
      formData.AttachmentsPdf &&
      formData.type
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

  const generateUniqueFileName = (originalName: string) => {
    const uniqueSuffix = uuidv4();
    const fileExtension = originalName.split('.').pop();
    return `${originalName.split('.')[0]}-${uniqueSuffix}.${fileExtension}`;
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uniqueFileName = generateUniqueFileName(file.name);
        const fileRef = ref(storage, `files/${uniqueFileName}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        setFormData((prevData) => ({
          ...prevData,
          [field]: downloadURL,
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
      // Add document to Firestore
      await addDoc(collection(db, "AbstractSubmissionData"), {
        ...formData,
      });
      console.log("Document added successfully");
      setLoading(false);
      setFormData(initialFormData);
      toast.success("Congratulations, you have successfully submitted the Abstract!");
    } catch (error) {
      console.error("Error adding document", error);
      setError(error);
      setLoading(false);
      toast.error("Something broke while submitting the Abstract!");
    }
  };

  return (
    <div className="bg-white mb-5">
      <div className="shadow-md rounded-md md:w-1/3 mx-auto pt-8 bg-white text-black">
        <h1 className="text-primary text-center text-xl">
          Abstract Submission Form
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="*Your full name*"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="*your@example.com*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Paper Title
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
              Upload Abstract &#40;Word&#41;
            </label>
            <input
              type="file"
              name="AttachmentsWord"
              accept=".doc, .docx"
              onChange={(e) => handleFileChange(e, "AttachmentsWord")}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
            />
          </div>

          {/* Input for PDF file */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Upload Abstract &#40;PDF&#41;
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
              Corresponding Author Name
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
              Co&#45;Author Names
            </label>
            <input
              type="text"
              name="CoauthorNames"
              value={formData.CoauthorNames}
              placeholder="*your@example.com*"
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
              placeholder="*your@example.com*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Keywords
            </label>
            <input
              type="text"
              name="Keywords"
              value={formData.Keywords}
              placeholder="*your@example.com*"
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Contact Number
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
              Select Type &#40;Fee&#41;
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            >
              <option value="">Select Type</option>
              <option value="Research Scholars and Students">
                Research Scholars and Students
              </option>
              <option value="Delegates from Academics, R&D and Institutions">
                Delegates from Academics, R&#38;D and Institutions
              </option>
              <option value="Delegates from Industry">
                Delegates from Industry
              </option>
            </select>
          </div>

          {formData.type && (
            <>
              <div className="text-sm text-gray-600 mb-4">
                Note&#58; Abstract Submission will be valid only if you upload the payment
                receipt successfully. The Fee amount displayed above
                the &#34;Payment QR Code&#34; must be paid. Without that, the
                Submission will be canceled.
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  <b>
                  &#8377;&#58;{" "}
                    {formData.type === "Research Scholars and Students"
                      ? 1100
                      : formData.type ===
                        "Delegates from Academics, R&D and Institutions"
                      ? 2100
                      : 3100}
                  </b>
                  <img className="p-2" src="2024K/Sponsor.png" alt="Fee" />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Upload Payment Receipt
                </label>
                <input
                  type="file"
                  name="FeeReceipt"
                  accept=".pdf, .png, .jpg"
                  onChange={(e) => handleFileChange(e, "FeeReceipt")}
                  className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
                />
              </div>
            </>
          )}

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

export default AbstractSubmission;
