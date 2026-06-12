'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { submitLegacyForm } from '@/lib/legacyFormSubmit';
import toast, { Toaster } from "react-hot-toast";
import RegistrationFormWrapper from "../ui/RegistrationFormWrapper";

interface NgoData {
  name: string;
  Affiliation: string;
  email: string;
  PhoneNumber: string;
  Services: string;
  Attachments: string;
  accommodation: string; // New field for accommodation
}

const VolReg = () => {
  const initialFormData: NgoData = {
    name: '',
    Affiliation: '',
    email: '',
    PhoneNumber: '',
    Services: '',
    Attachments: '',
    accommodation: '', // Initialize empty
  };

  const [formData, setFormData] = useState<NgoData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAccommodationButton, setShowAccommodationButton] = useState(false); // To show the booking button

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    try {
      await submitLegacyForm({
        registrationType: 'Volunteer',
        data: {
          ...formData,
          fullName: formData.name,
          email: formData.email,
          contactNumber: formData.PhoneNumber,
          institution: formData.Affiliation,
          accommodationRequired: formData.accommodation === 'yes' ? 'Yes' : 'No',
        },
        file: image,
        uploadFolder: 'volunteer',
        fileField: 'feeReceipt',
      });
      setFormData(initialFormData);
      setImage(null);
      toast.success("Successfully Registered!");
      if (formData.accommodation === 'yes') {
        setShowAccommodationButton(true);
      }
    } catch (error) {
      toast.error("Something broke while registering!");
      console.error('Error submitting registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationFormWrapper heading="Volunteer Registration Form">
      <form onSubmit={handleSubmit} className='bg-white p-4'>
        
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
          <label className="block text-sm font-medium text-gray-600">Affiliation:</label>
          <input
            type="text"
            name="Affiliation"
            value={formData.Affiliation}
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
          <label className="block text-sm font-medium text-gray-600">Services:</label>
          <input
            name="Services"
            value={formData.Services}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Upload your resume:</label>
          <input
            type="file"
            name="Attachments"
            accept=".pdf, .png, .jpg"
            onChange={handleImageChange}
            className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Do you need accommodation?</label>
          <div className="mt-2">
            <input
              type="radio"
              id="yes"
              name="accommodation"
              value="yes"
              onChange={handleInputChange}
              required
            />
            <label htmlFor="yes" className="ml-2">Yes</label>
          </div>
          <div className="mt-2">
            <input
              type="radio"
              id="no"
              name="accommodation"
              value="no"
              onChange={handleInputChange}
              required
            />
            <label htmlFor="no" className="ml-2">No</label>
          </div>
        </div>

        <div className='text-xs text-red-600'>
          Note: Due to the large number of registrations, accommodation will be provided on a first-come, first-served basis. Once accommodation is arranged, we will let you know.
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading}
        >
          Submit
        </button>
      

      {/* Show the "Book Your Accommodation" button if user selects "Yes" */}
      {showAccommodationButton && (
        <div className="mt-4 text-center mb-4">
          <a
            href="https://ac.rase.co.in/"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Your Accommodation
          </a>
        </div>
      )}
      </form>
    </RegistrationFormWrapper>
  );
};

export default VolReg;
