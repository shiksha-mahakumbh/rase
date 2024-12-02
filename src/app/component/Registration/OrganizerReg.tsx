"use client";

import { useState } from "react";
import { message } from "antd"; // Import Ant Design's message component
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Modular Firestore imports
import { initializeApp } from "firebase/app"; // Import initializeApp
import { getFirestore as getFirestoreFromApp } from "firebase/firestore"; // Import getFirestore
import { firebaseConfig } from "../../firebase"; // Import your Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Ensure firebaseConfig is correctly exported from your firebaseConfig file
const firestore = getFirestoreFromApp(app); // Initialize Firestore with the configured app

const OrganiserRegistration = () => {
  // Define allowed state codes
  const stateCodes = {
    PB001: "Punjab",
    HR001: "Haryana",
    HP001: "Himachal Pradesh",
    JK001: "J&K",
    DL001: "Delhi",
  } as const; // Using 'as const' to ensure state codes are strictly typed.

  // State management
  type StateCode = keyof typeof stateCodes | "";
  const [stateCode, setStateCode] = useState<StateCode>(""); // StateCode type includes the valid codes or empty string
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    designation: "",
    institution: "",
    duty: "",
    email: "",
    accommodation: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false); // New state to manage form submission

  // Handle form submission for state code validation
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stateCode in stateCodes) {
      setIsCodeValid(true);
      message.success("State code validated successfully!");
    } else {
      message.error("Invalid State Code! Please enter a valid code.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if phone number already exists in Firestore
  const isPhoneNumberRegistered = async (phone: string) => {
    const q = query(
      collection(firestore, "organiserregistration"),
      where("phone", "==", phone)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // Submit form to Firebase
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.designation || !formData.institution || !formData.duty || !formData.accommodation) {
      message.error("Please fill all mandatory fields.");
      return;
    }

    try {
      // Check if the phone number is already registered
      const phoneExists = await isPhoneNumberRegistered(formData.phone);
      if (phoneExists) {
        message.error("This phone number is already registered.");
        return;
      }

      // Add the form data to Firestore using the modular API
      await addDoc(collection(firestore, "organiserregistration"), {
        ...formData,
        state: stateCodes[stateCode as keyof typeof stateCodes],
        stateCode,
      });
      message.success("Registration successful!");

      // Clear the form fields and state code
      setFormData({
        name: "",
        phone: "",
        designation: "",
        institution: "",
        duty: "",
        email: "",
        accommodation: "",
      });
      setStateCode("");
      setIsCodeValid(false); // Reset the code validation
      setFormSubmitted(true); // Set formSubmitted to true to hide the form
    } catch (error) {
      message.error("Error while submitting the form. Please try again.");
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="container mx-auto items-center p-8">
      <h1 className="text-primary text-2xl text-center font-bold mb-6">
        Shiksha Mahakumbh 2024 Organiser Registration
      </h1>

      {!formSubmitted && !isCodeValid ? (
        <form onSubmit={handleCodeSubmit} className="shadow-md rounded-md m-auto md:w-1/2 p-4">
          <label className="block mb-2 text-lg">
            Enter State Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={stateCode}
            onChange={(e) => {
              const code = e.target.value.toUpperCase() as StateCode; // Convert to uppercase
              setStateCode(code);
            }}
            className="border border-gray-300 p-2 w-full mb-4"
            placeholder="Enter state code"
            required
          />
          <p className="text-red-500 text-sm mb-4">
            State code should be entered in CAPITAL letters.
          </p>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Validate State Code
          </button>
        </form>
      ) : !formSubmitted && isCodeValid ? (
        <form onSubmit={handleFormSubmit} className="shadow-md rounded-md m-auto md:w-1/2 p-4">
          <div className="mb-4">
            <label className="block mb-2 text-lg">
              State
            </label>
            <input
              type="text"
              value={stateCodes[stateCode as keyof typeof stateCodes]}
              className="border border-gray-300 p-2 w-full"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-lg">
            Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Duty Assigned <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="duty"
              value={formData.duty}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg">
              Accommodation Needed? <span className="text-red-500">*</span>
            </label>
            <select
              name="accommodation"
              value={formData.accommodation}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-center">
        <h2 className="text-lg font-semibold">Thank you for registering!</h2>
        <p>Your registration has been successfully submitted.</p>
        <a href="/rase.co.in" className="p-4"><button className="bg-primary text-white rounded-md P-4 mt-2 mb-2">Home</button></a>
      </div>
      )}
    </div>
  );
};

export default OrganiserRegistration;
