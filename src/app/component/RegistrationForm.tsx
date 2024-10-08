"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/firebase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import toast, { Toaster } from "react-hot-toast";

interface FormData {
  name: string;
  type: string;
  website: string;
  cont: string;
  role: string;
  email: string;
  contactNumber: string;
  feeReceipt: string;
  vb: string;
  feeAmount: number;
}

const RegistrationForm = () => {
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
  };
  const [formData, setFormData] = useState<FormData>({
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
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handletype = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormData((prevData) => ({
      ...prevData,
      feeAmount: 0,
    }));
    setFormData((prevData) => ({
      ...prevData,
      role: "",
    }));
  };
  const handlevb = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormData((prevData) => ({
      ...prevData,
      feeAmount: 0,
    }));
    setFormData((prevData) => ({
      ...prevData,
      role: "",
    }));
  };

  const handleRole = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    console.log(formData.vb);
    if (formData.vb === "nvb") {
      if (value === "teacher") {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 1000,
        }));
      } else if (value === "principle") {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 2000,
        }));
      } else if (value === "dirVcCP") {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 3000,
        }));
      } else if (value === "DelegatesFromIndustry") {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 8000,
        }));
      } else if (value === "ResearchScholar") {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 2000,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 0,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        feeAmount: 0,
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, "ParticipantReg"), {
        ...formData,
        feeReceipt: downloadURL,
      });
      console.log("Document added with ID:", docRef.id);
      setLoading(false);
      toast.success("Suceessfully Registered!");
      setFormData(initialFormData);
    } catch (error) {
      setLoading(false);
      toast.error("Something broke while registration!");
      console.error("Error adding document:", error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Upload image if it exists
    if (image) {
      try {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);

        // Get download URL using a Promise
        const downloadURL = await getDownloadURL(imageRef);

        // Update formData with the download URL
        setFormData((prevData) => ({
          ...prevData,
          feeReceipt: downloadURL || "", // Use an empty string if downloadURL is undefined
        }));

        // Add document to Firestore
        handleAddDocument(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
      }
    } else {
      // Add document to Firestore without image
      handleAddDocument(null);
    }

    // Perform actions with the form data and updated image URL
    console.log(formData);
  };
  useEffect(() => {
    // Check if we are on the client side before running analytics-related code
    if (typeof window !== "undefined") {
      import("firebase/analytics")
        .then(({ getAnalytics }) => {
          const analytics = getAnalytics();
          // Add your Firebase Analytics code here
          // For example: analytics.logEvent('page_view');
        })
        .catch((error) => {
          console.error("Error importing Firebase Analytics:", error);
        });
    }
  }, []);
  return (
    <div className="shadow-md rounded-md max-w-md mx-auto mt-8">
      <h1 className="text-primary text-center text-xl">
        Participant Registration
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-4">
        {/* Name Field */}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Type:
            <select
              name="type"
              value={formData.type}
              onChange={handletype}
              required
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            >
              <option value="">Select Type</option>
              <option value="Delegate">Delegate</option>
              <option value="Institutions">Institutions</option>
            </select>
          </label>
        </div>

        {formData.type === "Delegate" && (
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

            {/* Role Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Delegate:
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleRole}
                  required
                  className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                >
                  <option value="">Select Role</option>
                  <option value="DelegatesFromIndustry">
                    Delegates from Industry
                  </option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="principle">Principle</option>
                  <option value="dirVcCP">Director/VC/Chairperson</option>
                  <option value="ResearchScholar">Research scholar</option>
                </select>
              </label>
            </div>

            {/* Display fee amount if it's non-zero */}
            {formData.feeAmount !== 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  <b>Fees: {formData.feeAmount}</b>
                  <br />
                  <img className="p-2" src="/2024K/Sponsor.png" alt="Fee" />
                </label>
              </div>
            )}

            {/* Email Field */}
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

            {/* Contact Number Field */}
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
        )}
        {formData.type === "Institutions" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Institutions Name:
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
            {/* Role Dropdown */}
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
                  <option value="teacher">NGO/Society/Trust</option>
                </select>
              </label>
            </div>
            {/* Display fee amount if it's non-zero */}
            {formData.feeAmount !== 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium  text-black">
                  <b>Fees: {formData.feeAmount}</b>
                  <br />
                  <img className="p-2" src="/fee.png" alt="Fee" />
                </label>
              </div>
            )}
            {/* Email Field */}
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
            {/* Contact Number Field */}
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
            </div>{" "}
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
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading} // Disable the button when loading
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
