"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import DelegateForm from "./DelegateForm";
import InstitutionForm from "./InstitutionForm";
import TalentForm from "./TalentForm";
import VolunteerForm from "./VolunteerForm";
import NGOForm from "./NGOForm";
import ConclaveForm from "./ConclaveForm";
import { storage } from "@/app/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import { FormData } from "../Types";

const RegistrationPage = () => {
  const initialFormData: FormData = {
    name: "",
    type: "",
    website: "",
    cont: "",
    role: "",
    email: "",
    contactNumber: "",
    feeReceipt: "",
    vb: "",
    feeAmount: 0,
    category: "",
    description: "",
    services: "",
    registrationNumber: "",
    contribution: "",
    designation: "",
    institutionName: "",
    event_type:"",
    address: "",
    views: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("delegate");
  const [eventCategory, setEventCategory] = useState<string>("conference");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handlevb = (event: ChangeEvent<HTMLSelectElement>) => {
    const vbValue = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      vb: vbValue,
      feeAmount: vbValue === "vb" ? 200 : 0,
    }));
  };

  const handleRole = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      role: event.target.value,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleEventCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEventCategory(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let downloadURL = "";
    if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        downloadURL = await getDownloadURL(imageRef);
        setImageUrl(downloadURL);
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                feeReceipt: downloadURL || "",
                event_type: eventCategory, // Here is the event type being sent
            }),
        });

        if (response.ok) {
            toast.success("Form submitted successfully!");
            setFormData(initialFormData);
            setImage(null);
        } else {
            toast.error("Submission failed. Please try again.");
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        toast.error("Submission failed. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Event Registration</h1>

        {/* Event Category Selection */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">Select Event Category</label>
          <select 
            value={eventCategory} 
            onChange={handleEventCategoryChange} 
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conclave">Conclave</option>
            <option value="exhibition">Exhibition</option>
          </select>
        </div>

        {/* Form Category Selection */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">Select Registration Type</label>
          <select 
            value={category} 
            onChange={handleCategoryChange} 
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="delegate">Delegate</option>
            <option value="institution">Institution</option>
            <option value="talent">Talent</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
            <option value="conclave">Conclave</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {category === "delegate" && (
            <DelegateForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleRole={handleRole}
              handlevb={handlevb}
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
            />
          )}

          {category === "institution" && (
            <InstitutionForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleRole={handleRole}
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
            />
          )}

          {category === "talent" && (
            <TalentForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
            />
          )}

          {category === "volunteer" && (
            <VolunteerForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
            />
          )}

          {category === "ngo" && (
            <NGOForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleImageChange={handleImageChange}
              imageUrl={imageUrl}
            />
          )}

          {category === "conclave" && (
            <ConclaveForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        
        <Toaster />
      </div>
    </div>
  );
};

export default RegistrationPage;
