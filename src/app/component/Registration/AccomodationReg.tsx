"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { message, Spin } from "antd";
import axios from "axios"; // Axios for API requests
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import Image from "next/image";

interface AccommodationData {
  name: string;
  email: string;
  ContactNumber: string;
  Designation: string;
  Delegate: string;
  Delegatetype: string;
  event: string;
  accommodationtype: string;
  accommodationdate: string;
  FeeReceipt: File | null;
}

const Forms = () => {
  const initialFormData: AccommodationData = {
    name: "",
    email: "",
    ContactNumber: "",
    Designation: "",
    Delegate: "",
    Delegatetype: "",
    event: "",
    accommodationtype: "",
    accommodationdate: "",
    FeeReceipt: null,
  };

  const [formData, setFormData] = useState<AccommodationData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>("");

  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.ContactNumber &&
      formData.Designation &&
      formData.Delegate &&
      formData.Delegatetype &&
      formData.event &&
      formData.accommodationtype &&
      formData.accommodationdate &&
      formData.FeeReceipt
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        FeeReceipt: file,
      }));
    }
  };

  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedEvent(selectedValue);
    setSelectedAccommodation("");
    setFormData((prevData) => ({
      ...prevData,
      event: selectedValue,
      accommodationtype: "",
    }));
  };

  const handleAccommodationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedAccommodation(selectedValue);
    setFormData((prevData) => ({
      ...prevData,
      accommodationtype: selectedValue,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isFormValid()) {
      message.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();

    // Append form data to FormData object
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("ContactNumber", formData.ContactNumber);
    formDataToSend.append("Designation", formData.Designation);
    formDataToSend.append("Delegate", formData.Delegate);
    formDataToSend.append("Delegatetype", formData.Delegatetype);
    formDataToSend.append("event", formData.event);
    formDataToSend.append("accommodationtype", formData.accommodationtype);
    formDataToSend.append("accommodationdate", formData.accommodationdate);
  
    if (formData.FeeReceipt) {
      formDataToSend.append("FeeReceipt", formData.FeeReceipt);
    }
  
    try {
      // Make API request
      const response = await axios.post("http://localhost:5000/Accomodation", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setLoading(false);
      setFormData(initialFormData);
  
      // Display a success alert
      alert("Congratulations, you have successfully booked the accommodation!");
  
      console.log("Response from server:", response.data);  // Optional: Log server response
    } catch (error) {
      console.error("Error submitting form", error);
      setLoading(false);
      alert("Congratulations, you have successfully booked the accommodation!");
    }
  };
  return (
    <div className="bg-white mb-5 mt-4">
    <div className="shadow-md rounded-md mx-auto bg-white text-black max-w-4xl w-full">
      <h1 className="text-white bg-[#6096B4] p-4 text-center text-xl font-semibold">
        Book Your Accommodation
      </h1>
      <form className="bg-[#e8eff3] p-4" onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">
            Name <span className="text-red-700 text-lg">&#42;</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Full Name"
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>
          <div className="mb-4">
            <label className="block text-sm  font-semibold text-gray-600">
              Email <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@example.com"
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm  font-semibold text-gray-600">
              Contact Number <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="tel"
              name="ContactNumber"
              placeholder="1234567890"
              value={formData.ContactNumber}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm  font-semibold text-gray-600">
              Designation <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleInputChange}
              placeholder="Enter Your Designation"
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm  font-semibold text-gray-600">
              Accommodation Date{" "}
              <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <select
                name="accommodationdate"
                value={formData.accommodationdate}
                onChange={handleInputChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              >
              <option value="">Select Type</option>
              <option value="15 December">15 December</option>
              <option value="16 December">16 December</option>
              <option value="17 December">17 December</option>
              <option value="15,16 December">15,16 December</option>
              <option value="15,17 December">15,17 December</option>
              <option value="16,17 December">16,17 December</option>
              <option value="15,16,17 December">15,16,17 December</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-between">
            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm  font-semibold text-gray-600">
                Delegate <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="Delegate"
                value={formData.Delegate}
                onChange={handleInputChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              >
                <option value="">Select Type</option>
                <option value="Author">Author</option>
                <option value="Industry">Industry</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="NGO">NGO</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Guest">Guest</option>
                <option value="VVIP">VVIP</option>
              </select>
            </div>
            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm  font-semibold text-gray-600">
                Delegate Type{" "}
                <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="Delegatetype"
                value={formData.Delegatetype}
                onChange={handleInputChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              >
                <option value="">Select Type</option>
                <option value="Vidya Bharti">Vidya Bharti</option>
                <option value="Non Vidya Bharti">Non-Vidya Bharti</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap justify-between">
            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm  font-semibold text-gray-600">
                Event Name <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="event"
                value={formData.event}
                onChange={handleEventChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              >
                <option value="">Select Event</option>
                <option value="Shiksha MahaKumbh 2024">
                  Shiksha MahaKumbh 2024
                </option>
                {/* <option value="Rase Conferences 2024">
                  Rase Conferences 2024
                </option> */}
              </select>
            </div>
            {selectedEvent && (
              <div className="mb-4 sm:w-[15vw]">
                <label className="block text-sm  font-semibold text-gray-600">
                  Accommodation Type
                  <span className="text-red-700 text-lg">&#42;</span>
                </label>
                <select
                  name="accommodationtype"
                  value={formData.accommodationtype}
                  onChange={handleAccommodationChange}
                  className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                >
                  <option value="">Select Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                </select>
              </div>
            )}
          </div>
          {selectedAccommodation && (
            <>
              <div className="mb-4">
                <p>
                  <b>Amount:</b>{" "}
                  {selectedAccommodation === "Single" ? "Rs. 1500" : "Rs. 3000"}
                </p>
              </div>
              {selectedEvent === "Shiksha MahaKumbh 2024" && (
                <div className="mb-4">
                  <p>
                    <b>Account Name:</b> Shiksha Mahakumbh
                    <br />
                    <b>Account No.:</b> 42529022841
                    <br />
                    <b>Bank:</b> State Bank of India
                    <br />
                    <b>Branch:</b> Chandigarh Main Branch
                    <br />
                    <b>IFSC Code:</b> SBIN0000628
                    <br />
                    <b>UPI ID:</b> shikshamahakhumb@sbi
                  </p>
                  <Image
                    className="p-2"
                    src="/fee.png"
                    alt="Fee"
                    height={500}
                    width={500}
                  />
                </div>
              )}
              {selectedEvent === "Rase Conferences 2024" && (
                <div className="mb-4">
                  <p>
                    <b>Account Name:</b> Shiksha Kumbh
                    <br />
                    <b>Account No.:</b> 42563561350
                    <br />
                    <b>Bank:</b> State Bank of India
                    <br />
                    <b>Branch:</b> Chandigarh Main Branch
                    <br />
                    <b>IFSC Code:</b> SBIN0000628
                    <br />
                    <b>UPI ID:</b> shikshakhumb@sbi
                  </p>
                  <Image
                    className="p-2"
                    src="/fee.png"
                    alt="Fee"
                    height={500}
                    width={500}
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm  font-semibold text-gray-600">
                  Upload Payment Receipt{" "}
                  <span className="text-red-700 text-lg">&#42;</span>
                </label>
                <div className="relative">
                <input
                type="file"
                name="FeeReceipt"
                accept=".pdf, .png, .jpg"
                onChange={handleFileChange}
                className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black bg-white"
              />
                  {loading && (
                    <div className="absolute inset-0 mr-8 flex items-center justify-center">
                      <Spin size="large" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-color transition duration-300 mt-4 w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default Forms;