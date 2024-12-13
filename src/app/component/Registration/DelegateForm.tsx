'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface FormData {
  name: string;
  type: string;
  websiteLink: string;
  contribution: string;
  role: string;
  email: string;
  contactNumber: string;
  feeReceipt: string;
  vb: string;
  feeAmount: number;
  accommodation: string;
}

const RegistrationForm = () => {
  const initialFormData: FormData = {
    name: '',
    type: '',
    websiteLink: '',
    contribution: '',
    role: '',
    email: '',
    contactNumber: '',
    feeReceipt: '',
    vb: '',
    feeAmount: 0,
    accommodation: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRole = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    let fee = 0;

    if (formData.vb === 'nvb') {
      switch (value) {
        case 'teacher':
          fee = 1000;
          break;
        case 'principle':
          fee = 2000;
          break;
        case 'dirVcCP':
          fee = 3000;
          break;
        case 'DelegatesFromIndustry':
          fee = 8000;
          break;
        case 'ResearchScholar':
          fee = 2000;
          break;
        default:
          fee = 0;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      feeAmount: fee,
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

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, String(value));
    });

    if (image) {
      submissionData.append('feeReceipt', image);
    }

    try {
     // const response = await fetch("http://localhost:5000/Conclave", {

      const response = await axios.post('http://localhost:5000/delegate', submissionData);
      if (response.status === 200) {
        toast.success('Successfully Registered!');
        setFormData(initialFormData);
        setImage(null);
      } else {
        toast.error('Failed to Register. Try Again!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-md rounded-md max-w-md mx-auto mt-8">
      <h1 className="text-primary text-center text-xl">Participant Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4">
        {/* Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Type<span className="text-red-700 text-base">*</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            >
              <option value="">Select Type</option>
              <option value="Delegate">Delegate</option>
              <option value="Institutions">Institutions</option>
            </select>
          </label>
        </div>

        {/* Common Fields */}
        {formData.type && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                {formData.type === 'Delegate' ? 'Name' : 'Institution Name'}
                <span className="text-red-700 text-base">*</span>
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

            {/* Additional Fields Based on Type */}
            {formData.type === 'Delegate' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Delegate Type<span className="text-red-700 text-base">*</span>
                    <select
                      name="vb"
                      value={formData.vb}
                      onChange={handleInputChange}
                      required
                      className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                    >
                      <option value="">Select Type</option>
                      <option value="vb">Vidya Bharti</option>
                      <option value="nvb">Non Vidya Bharti</option>
                    </select>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Role<span className="text-red-700 text-base">*</span>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleRole}
                      required
                      className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                    >
                      <option value="">Select Role</option>
                      <option value="teacher">Teacher</option>
                      <option value="principle">Principal</option>
                      <option value="dirVcCP">Director/VC/Chairperson</option>
                      <option value="DelegatesFromIndustry">Delegates from Industry</option>
                      <option value="ResearchScholar">Research Scholar</option>
                    </select>
                  </label>
                </div>
              </>
            )}
          </>
        )}

        {/* Fee Display */}
        {formData.feeAmount > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Fee: <b>{formData.feeAmount}</b>
              <img src="/fee.png" alt="Fee Info" className="mt-2 h-16" />
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
