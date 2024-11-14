"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { message, Spin } from "antd"; // Import message from Ant Design
import axios from "axios"; // Axios to send HTTP requests
import { v4 as uuidv4 } from "uuid";

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
  FeeReceipt: string | null;
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

  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedEvent(selectedValue);
    setSelectedAccommodation("");
    setFormData((prevData) => ({
      ...prevData,
      event: selectedValue,
      accommodationtype: "", // Reset accommodation type
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

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true); // Start loading
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload-file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const fileURL = response.data.fileURL;
        setFormData((prevData) => ({
          ...prevData,
          [field]: fileURL,
        }));
      } catch (error) {
        console.error("Error uploading file:", error);
        setError(error);
        message.error("Error uploading file.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isFormValid()) {
      message.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/submit-accommodation", formData);
      console.log("Accommodation booked successfully");
      setLoading(false);
      setFormData(initialFormData);
      message.success(
        "Congratulations, you have successfully booked the accommodation!"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error);
      setLoading(false);
      message.error("Something went wrong while booking the accommodation.");
    }
  };

  return (
    <div className="bg-white mb-5 mt-4">
      <div className="shadow-md rounded-md mx-auto bg-white text-black max-w-2xl w-full"> 
        <div className="text-sm bg-[#e8eff3] text-red-900">
          Note: Due to the large number of registrations, accommodation will be provided on a first-come, first-served basis. Once accommodation is arranged, we will let you know.
        </div>
        <h1 className="text-white bg-[#6096B4] p-4 text-center text-xl font-semibold">
          Book Your Accommodation
        </h1>
        <form className="bg-[#e8eff3] p-4" onSubmit={handleSubmit}>
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@example.com"
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Contact Number <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="tel"
              name="ContactNumber"
              placeholder="1234567890"
              value={formData.ContactNumber}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Designation <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleInputChange}
              placeholder="Enter Your Designation"
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Accommodation Date{" "}
              <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <select
              name="accommodationdate"
              value={formData.accommodationdate}
              onChange={handleInputChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              required
            >
              <option value="">Select Date</option>
              <option value="4">4 October</option>
              <option value="5">5 October</option>
              <option value="6">6 October</option>
              <option value="4,5">4,5 October</option>
              <option value="5,6">5,6 October</option>
              <option value="4,6">4,6 October</option>
              <option value="4,5,6">4,5,6 October</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-between">
            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm font-semibold text-gray-600">
                Delegate <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="Delegate"
                value={formData.Delegate}
                onChange={handleInputChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                required
              >
                <option value="">Select Type</option>
                <option value="Author">Author</option>
                <option value="Industry">Industry</option>
                <option value="Government">Government</option>
                <option value="Student">Student</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm font-semibold text-gray-600">
                Event <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="event"
                value={selectedEvent}
                onChange={handleEventChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                required
              >
                <option value="">Select Event</option>
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-[#6096B4] text-white p-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forms;
