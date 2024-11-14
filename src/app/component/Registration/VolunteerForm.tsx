// `VolReg.tsx`
'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import toast, { Toaster } from "react-hot-toast";

interface NgoData {
  name: string;
  Affiliation: string;
  email: string;
  PhoneNumber: string;
  Services: string;
  accommodation: string;
}

const VolReg = () => {
  const initialFormData: NgoData = {
    name: '',
    Affiliation: '',
    email: '',
    PhoneNumber: '',
    Services: '',
    accommodation: '',
  };

  const [formData, setFormData] = useState<NgoData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAccommodationButton, setShowAccommodationButton] = useState(false);

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

    const formDataWithImage = new FormData();
    formDataWithImage.append('name', formData.name);
    formDataWithImage.append('Affiliation', formData.Affiliation);
    formDataWithImage.append('email', formData.email);
    formDataWithImage.append('PhoneNumber', formData.PhoneNumber);
    formDataWithImage.append('Services', formData.Services);
    formDataWithImage.append('accommodation', formData.accommodation);

    if (image) {
      formDataWithImage.append('Attachments', image);
    }

    try {
      const response = await fetch('/api/volunteer-registration', {
        method: 'POST',
        body: formDataWithImage,
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Successfully Registered!");
        setLoading(false);
        setFormData(initialFormData);
        if (formData.accommodation === 'yes') {
          setShowAccommodationButton(true);
        }
      } else {
        toast.error("Registration failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
      <h1 className='text-primary text-center text-xl'>Volunteer Registration Form</h1>
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

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading}
        >
          Submit
        </button>

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
    </div>
  );
};

export default VolReg;
