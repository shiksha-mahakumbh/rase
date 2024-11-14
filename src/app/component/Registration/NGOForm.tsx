"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";

interface NgoData {
  name: string;
  RegistrationNo: string;
  email: string;
  Website: string;
  PhoneNumber: string;
  Contribution: string;
  Attachments: string;
  accommodation: string;
}

const NGOReg = () => {
  const initialFormData: NgoData = {
    name: "",
    RegistrationNo: "",
    email: "",
    Website: "",
    PhoneNumber: "",
    Contribution: "",
    Attachments: "",
    accommodation: "",
  };

  const [formData, setFormData] = useState<NgoData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showBookingButton, setShowBookingButton] = useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Prepare the data for the backend
    const formPayload = {
      ...formData,
      Attachments: image ? URL.createObjectURL(image) : "",
    };

    try {
      const response = await fetch("http://localhost:5000/submit-ngo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully Registered!");
        setShowBookingButton(formData.accommodation === "yes");
        setFormData(initialFormData);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-md rounded-md max-w-md mx-auto mt-8">
      <Toaster />
      <h1 className="text-primary text-center text-xl">NGO Registration Form</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Registration Number:</label>
          <input
            type="text"
            name="RegistrationNo"
            value={formData.RegistrationNo}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Website:</label>
          <input
            type="text"
            name="Website"
            value={formData.Website}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Phone Number:</label>
          <input
            type="tel"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Contribution:</label>
          <input
            name="Contribution"
            value={formData.Contribution}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Attachments:</label>
          <input
            type="file"
            name="Attachments"
            accept=".pdf, .png, .jpg"
            onChange={handleImageChange}
            className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
          />
        </div>

        {/* Accommodation option */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Do you require accommodation?</label>
          <div className="flex mt-2">
            <label className="mr-4">
              <input
                type="radio"
                name="accommodation"
                value="yes"
                onChange={handleInputChange}
                required
                className="mr-2"
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="accommodation"
                value="no"
                onChange={handleInputChange}
                required
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div className="text-xs text-red-600">
          Note: Due to the large number of registrations, accommodation will be
          provided on a first-come, first-served basis. Once accommodation is
          arranged, we will let you know.
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Conditionally show the booking button */}
      {showBookingButton && (
        <div className="mt-4 text-center">
          <a
            href="https://www.ac.rase.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Book Your Accommodation
          </a>
        </div>
      )}
    </div>
  );
};

export default NGOReg;
