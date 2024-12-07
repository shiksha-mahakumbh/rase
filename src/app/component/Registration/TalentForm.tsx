"use client";
import { ChangeEvent, useState } from "react";
import { db, storage } from "@/app/firebase";  // Make sure Firebase is set up
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";

// Type for the form data
interface TalentFormData {
  name: string;
  talentName: string;
  institutionName: string;
  talentType: string;
  email: string;
  contactNumber: string;
  description: string;
  attachment?: string; // Store the URL for the uploaded file
}

const TalentForm = () => {
  const [formData, setFormData] = useState<TalentFormData>({
    name: "",
    talentName: "",
    institutionName: "",
    talentType: "",
    email: "",
    contactNumber: "",
    description: "",
  });

  const [imageUrl, setImageUrl] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageUrl(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If there's an image file, upload it to Firebase Storage
      let imageUrlFirebase = "";

      if (imageUrl) {
        const imageRef = ref(storage, `talent_images/${imageUrl.name}`);
        await uploadBytes(imageRef, imageUrl); // Upload the image file
        imageUrlFirebase = await getDownloadURL(imageRef); // Get the URL of the uploaded file
      }

      // Prepare the form data to be submitted to Firestore
      const newFormData = { ...formData, attachment: imageUrlFirebase };

      // Add data to Firestore
      await addDoc(collection(db, "talent"), newFormData);

      toast.success("Form submitted successfully!");
      setFormData({
        name: "",
        talentName: "",
        institutionName: "",
        talentType: "",
        email: "",
        contactNumber: "",
        description: "",
      });
      setImageUrl(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error submitting talent form:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 shadow-md rounded-md bg-white">
      <h1 className="text-center text-xl font-semibold text-primary">Talent Registration Form</h1>
      <Toaster />
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Talent Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Talent Name:</label>
          <input
            type="text"
            name="talentName"
            value={formData.talentName}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Institution Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Institution Name:</label>
          <input
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Talent Type Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Category:</label>
          <select
            name="talentType"
            value={formData.talentType}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          >
            <option value="">Select Talent Type</option>
            <option value="student">Student</option>
            <option value="principal">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Contact Number Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* File Upload Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Upload Attachment:</label>
          <input
            type="file"
            accept=".pdf, .png, .jpg"
            onChange={handleImageChange}
            className="mt-2 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="max-w-full rounded-md" />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TalentForm;
