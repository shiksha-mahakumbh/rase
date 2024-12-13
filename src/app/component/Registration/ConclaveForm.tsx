'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast, { Toaster } from 'react-hot-toast';

interface ConclaveData {
  typeofConclave: string;
  name: string;
  designation: string;
  institutionName: string;
  email: string;
  contactNumber: string;
  address: string;
  views: string;
  accommodation: string;
}

const ConclaveForm = () => {
  const initialFormData: ConclaveData = {
    typeofConclave: '',
    name: '',
    designation: '',
    institutionName: '',
    email: '',
    contactNumber: '',
    address: '',
    views: '',
    accommodation: '',
  };

  const [formData, setFormData] = useState<ConclaveData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showAccommodationButton, setShowAccommodationButton] = useState(false); // To show the booking button

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'ConclaveRegistrations'), formData);
      toast.success('Form submitted successfully!');
      setFormData(initialFormData); // Reset the form after successful submission
      if (formData.accommodation === 'yes') {
        setShowAccommodationButton(true); // Show the button if 'Yes' is selected
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 shadow-md rounded-md bg-white">
      <h1 className="text-center text-xl font-semibold text-primary">
        Conclave Registration Form
      </h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <Toaster />

        {/* Type of Conclave */}
        <div className="mb-4">
          <label htmlFor="typeofConclave" className="block text-sm font-medium text-gray-600">
            Select Conclave Type:
          </label>
          <select
            id="typeofConclave"
            name="typeofConclave"
            value={formData.typeofConclave}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          >
            <option value="" disabled>
              Select Conclave Type
            </option>
            <option value="academic">VC/Directors&apos; Conclave</option>
            <option value="industry">Principals&apos; Conclave</option>
            <option value="research">Entrepreneurs/Bureaucrats&apos; Conclave</option>
            <option value="innovation">Student Leaders&apos; Conclave</option>
            <option value="academic">Scientists&apos; Conclave</option>
            <option value="industry">Social Media Influencers&apos; Conclave</option>
            <option value="research">Electronic and Print Media Conclave</option>
          </select>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Full Name:
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Designation */}
        <div className="mb-4">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-600">
            Designation:
          </label>
          <input
            id="designation"
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Institution/Organization */}
        <div className="mb-4">
          <label htmlFor="institutionName" className="block text-sm font-medium text-gray-600">
            Institution/Organization Name:
          </label>
          <input
            id="institutionName"
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-600">
            Contact Number:
          </label>
          <input
            id="contactNumber"
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            Address:
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
          />
        </div>

        {/* Views */}
        <div className="mb-4">
          <label htmlFor="views" className="block text-sm font-medium text-gray-600">
            Your Views (200 words max):
          </label>
          <textarea
            id="views"
            name="views"
            value={formData.views}
            onChange={handleInputChange}
            maxLength={200}
            required
            className="mt-2 block w-full rounded-md border border-gray-300 p-2 text-black"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-md ${
            loading ? 'bg-gray-500' : 'bg-primary hover:bg-blue-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit'}
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

export default ConclaveForm;
