'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from "react-hot-toast";

interface FormData {
  name: string;
  type: string;
  Websitelink: string;
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
    Websitelink: '',
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
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Define the image URL
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Set feeAmount based on the role
    if (formData.vb === "nvb") {
      if (value === 'teacher') {
        setFormData((prevData) => ({ ...prevData, feeAmount: 1000 }));
      } else if (value === 'principle') {
        setFormData((prevData) => ({ ...prevData, feeAmount: 2000 }));
      } else if (value === 'dirVcCP') {
        setFormData((prevData) => ({ ...prevData, feeAmount: 3000 }));
      } else if (value === 'DelegatesFromIndustry') {
        setFormData((prevData) => ({ ...prevData, feeAmount: 8000 }));
      } else if (value === 'ResearchScholar') {
        setFormData((prevData) => ({ ...prevData, feeAmount: 2000 }));
      } else {
        setFormData((prevData) => ({ ...prevData, feeAmount: 0 }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, feeAmount: 0 }));
    }
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

    // If an image is provided, upload it and get the URL
    const formDataWithImage = { ...formData };

    if (image) {
      try {
        const formData = new FormData();
        formData.append('image', image);

        // Send image to backend for storage (e.g., save to a server or cloud storage)
        const imageUploadResponse = await fetch('/api/uploadImage', {
          method: 'POST',
          body: formData,
        });

        if (!imageUploadResponse.ok) {
          throw new Error('Error uploading image');
        }

        const imageResponse = await imageUploadResponse.json();
        const imageUrl = imageResponse.url;

        formDataWithImage.feeReceipt = imageUrl; // Set the image URL in form data
        setImageUrl(imageUrl); // Store the image URL in the state
      } catch (error) {
        setLoading(false);
        toast.error("Error uploading image");
        return;
      }
    }

    // Send form data to backend to save to MySQL database
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithImage),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully Registered!");
        setFormData(initialFormData);
        setImageUrl(null); // Reset the image URL after successful submission
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Error submitting form!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
      <h1 className='text-primary text-center text-xl'>Participant Registration</h1>
      <form onSubmit={handleSubmit} className='bg-white p-4'>
     
        {/* Name Field */}
       
        <div className='mb-4'>
        
          <label className='block text-sm font-medium text-gray-600'>
            Type<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            <select
              name='type'
              value={formData.type}
              onChange={handleInputChange}
              required
              className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
            >
              <option value=''>Select Type</option>
              <option value='Delegate'>Delegate</option>
              <option value='Institutions'>Institutions</option>
            </select>
          </label>
        </div>
         {/* Accommodation Field */}
         <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-600'>
            Do you require accommodation?<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            <select
              name='accommodation'
              value={formData.accommodation}
              onChange={handleInputChange}
              required
              className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
            >
              <option value=''>Select</option>
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </select>
          </label>
        </div>

        {/* Conditionally show the accommodation booking button */}
        {formData.accommodation === 'Yes' && (
          <div className='mb-4'>
            <button
              type="button"
              onClick={() => window.open('https://ac.rase.co.in/', '_blank')}  // Replace with actual booking link
              className='bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition duration-300 mt-4 w-full'
            >
              Book Accommodation
            </button>
          </div>
        )}

        {formData.type === 'Delegate' && (
          <>
           <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-600'>
            Name<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
            />
          </label>
        </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Delegate Type<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <select
                  name='vb'
                  value={formData.vb}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                >
                  <option value=''>Select Type</option>
                  <option value='vb'>Vidya Bharti</option>
                  <option value='nvb'>Non Vidya Bharti</option>
                </select>
              </label>
            </div>

            {/* Role Dropdown */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Delegate<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                >
                  <option value=''>Select Role</option>
                  <option value='DelegatesFromIndustry'>Delegates from Industry</option>
                  <option value='student'>Student</option>
                  <option value='teacher'>Teacher</option>
                  <option value='principle'>Principle</option>
                  <option value='dirVcCP'>Director/VC/ChairPersion</option>
                  <option value='ResearchScholar'>Research scholar</option>
                </select>
              </label>
            </div>

            {/* Display fee amount if it's non-zero */}
            {formData.feeAmount !== 0 && (
              <div className='mb-4'>
                <label className='block text-sm font-medium  text-black'>
                  <b>Fees: {formData.feeAmount}</b>
                  <br />
                  <img className='p-2 h-50 w-50' src='/fee.png' alt='Fee' />
                </label>
              </div>
            )}

            {/* Email Field */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Email<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div>

            {/* Contact Number Field */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Contact Number<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <input
                  type='tel'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div>

            {formData.feeAmount !== 0 && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-600 '>
                  Upload Fee Receipt<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                  <input
                    type='file'
                    accept='.pdf, .png, .jpg'
                    required={formData.feeAmount !== 0}
                    onChange={handleImageChange}
                    className='mt-4 p-2 block w-full rounded-md border-gray-300 text-black'
                  />
                </label>
              </div>
            )}

            {imageUrl && <img src={imageUrl} alt='Uploaded' style={{ maxWidth: '100%' }} />}
          </>
        )}
    {formData.type === 'Institutions' && (
          <>
           <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-600'>
          Institutions Name<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
            />
          </label>
        </div>

            

            {/* Role Dropdown */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
              Institution Type<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'>
                  <option value=''>Select Type</option>
                  <option value='Academica'>Academia</option>
                  <option value='Industry'>Industry</option>
                  <option value='teacher'>NGO/Society/Trust</option>
                 
                </select>
              </label>
            </div>

            {/* Display fee amount if it's non-zero */}
            {formData.feeAmount !== 0 && (
              <div className='mb-4'>
                <label className='block text-sm font-medium  text-black'>
                  <b>Fees: {formData.feeAmount}</b>
                  <br />
                  <img className='p-2' src='/fee.png' alt='Fee' />
                </label>
              </div>
            )}

            {/* Email Field */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Email<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div>

            {/* Contact Number Field */}
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
                Contact Number<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                <input
                  type='tel'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
              Website
                <input  
                  name='Websitelink'
                  value={formData.Websitelink}
                  onChange={handleInputChange}
                  
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div> <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-600'>
              Contribution
                <input
                  name='contribution'
                  value={formData.contribution}
                  onChange={handleInputChange}
                  
                  className='mt-4 p-2 block w-full rounded-md border border-gray-300 text-black'
                />
              </label>
            </div>
            {formData.feeAmount !== 0 && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-600 '>
                  Upload Fee Receipt<span className="text-red-700 text-base"><sup>&#42;</sup></span>
                  <input
                    type='file'
                    accept='.pdf, .png, .jpg'
                    required={formData.feeAmount !== 0}
                    onChange={handleImageChange}
                    className='mt-4 p-2 block w-full rounded-md border-gray-300 text-black'
                  />
                </label>
              </div>
            )}

            {imageUrl && <img src={imageUrl} alt='Uploaded' style={{ maxWidth: '100%' }} />}
          </>
        )}
        <label className='block text-sm font-medium text-red-900'>Note:There is no regestration fee for  non-Indian delegates.</label>
        <br/>
        <label className='block text-sm font-medium text-red-900'>Note: Due to the large number of registrations, accommodation will be provided on a first-come, first-served basis. Once accommodation is arranged, we will let you know.</label>

        {/* Submit Button */}
        <button
          type='submit'
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full'
          disabled={loading} // Disable the button when loading
        >
          Submit
        </button>
      </form>
    </div>)
};

export default RegistrationForm;