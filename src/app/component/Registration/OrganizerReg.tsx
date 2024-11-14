"use client";

import { useState } from "react";
import { message } from "antd";

const OrganiserRegistration = () => {
  const stateCodes = {
    PB001: "Punjab",
    HR001: "Haryana",
    HP001: "Himachal Pradesh",
    JK001: "J&K",
    DL001: "Delhi",
  } as const;

  type StateCode = keyof typeof stateCodes | "";
  const [stateCode, setStateCode] = useState<StateCode>(""); // To store state code
  const [isCodeValid, setIsCodeValid] = useState(false); // To check if state code is valid
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    designation: "",
    institution: "",
    duty: "",
    email: "",
    accommodation: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handler to validate the state code
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (stateCode in stateCodes) {
      setIsCodeValid(true);
      message.success("State code validated successfully!");
    } else {
      message.error("Invalid State Code! Please enter a valid code.");
    }
  };

  // Handle input changes for the form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.designation || !formData.institution || !formData.duty || !formData.accommodation) {
      message.error("Please fill all mandatory fields.");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          state: stateCodes[stateCode as keyof typeof stateCodes],
          stateCode,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        message.success(result.message);
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
        setIsCodeValid(false);
        setFormSubmitted(true);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Error while submitting the form. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto items-center p-8">
      <h1 className="text-primary text-2xl text-center font-bold mb-6">
        Shiksha Mahakumbh 2024 Organiser Registration
      </h1>

      {/* State Code Validation Form */}
      {!formSubmitted && !isCodeValid ? (
        <form onSubmit={handleCodeSubmit} className="shadow-md rounded-md m-auto md:w-1/2 p-4">
          <label className="block mb-2 text-lg">
            Enter State Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={stateCode}
            onChange={(e) => {
              const code = e.target.value.toUpperCase() as StateCode;
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
          {/* State Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">State</label>
            <input
              type="text"
              value={stateCodes[stateCode as keyof typeof stateCodes]}
              className="border border-gray-300 p-2 w-full"
              disabled
            />
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          {/* Designation Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          {/* Institution Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          {/* Duty Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Duty</label>
            <input
              type="text"
              name="duty"
              value={formData.duty}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
            />
          </div>

          {/* Accommodation Field */}
          <div className="mb-4">
            <label className="block mb-2 text-lg">Accommodation</label>
            <select
              name="accommodation"
              value={formData.accommodation}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
          >
            Submit Registration
          </button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-lg font-semibold">Thank you for registering!</h2>
          <p>Your registration has been successfully submitted.</p>
          <a href="https://sm24.rase.co.in/" className="p-4">
            <button className="bg-primary text-white rounded-md P-4 mt-2 mb-2">Home</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default OrganiserRegistration;
