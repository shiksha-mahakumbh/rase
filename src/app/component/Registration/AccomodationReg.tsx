"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { message, Spin } from "antd"; // Import message from Ant Design
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "@/app/firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
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

  const generateUniqueFileName = (originalName: string) => {
    const uniqueSuffix = uuidv4();
    const fileExtension = originalName.split(".").pop();
    return `${originalName.split(".")[0]}-${uniqueSuffix}.${fileExtension}`;
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true); // Start loading
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
        message.error("Error uploading file.");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedEvent(selectedValue);
    // Reset accommodation type when event changes
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!isFormValid()) {
      message.error("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "Accomodation"), {
        ...formData,
      });
      console.log("Document added successfully");
      setLoading(false);
      setFormData(initialFormData);
      message.success(
        "Congratulations, you have successfully Booked the Accomodation!"
      );
    } catch (error) {
      console.error("Error adding document", error);
      setError(error);
      setLoading(false);
      message.error("Something broke while Booking the Accomodation!");
    }
  };

  return (
    <div className="bg-white mb-5 mt-4">
      <div className="shadow-md rounded-md mx-auto bg-white text-black max-w-2xl w-full"> {/* Adjusted width */}
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
                Delegate Type <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="Delegatetype"
                value={formData.Delegatetype}
                onChange={handleInputChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                required
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
              </select>
            </div>

            <div className="mb-4 sm:w-[15vw]">
              <label className="block text-sm font-semibold text-gray-600">
                Event <span className="text-red-700 text-lg">&#42;</span>
              </label>
              <select
                name="event"
                value={formData.event}
                onChange={handleEventChange}
                className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                required
              >
                <option value="">Select Event</option>
                <option value="Event 1">Event 1</option>
                <option value="Event 2">Event 2</option>
                <option value="Event 3">Event 3</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Accommodation Type{" "}
              <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <select
              name="accommodationtype"
              value={formData.accommodationtype}
              onChange={handleAccommodationChange}
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
              required
            >
              <option value="">Select Accommodation</option>
              <option value="Single Room">Single Room</option>
              <option value="Double Room">Double Room</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Fee Receipt <span className="text-red-700 text-lg">&#42;</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileChange(e, "FeeReceipt")}
              className="mt-4 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            {loading && <Spin />}
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