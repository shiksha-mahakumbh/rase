'use client'
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { submitLegacyForm } from '@/lib/legacyFormSubmit';
import  toast , { Toaster } from "react-hot-toast";
import RegistrationFormWrapper from "../ui/RegistrationFormWrapper";

interface FormData {
  name: string;
  type:string;
  Websitelink:string;
  contribution:string;
  role: string;
  email: string;
  contactNumber: string;
  feeReceipt: string;
  vb: string;
  feeAmount: number;
  accommodation: string;
}

const RegistrationForm = () => {
 const initialFormData:FormData ={
    name: '',
    type:'',
    Websitelink:'',
    contribution:'',
    role: '',
    email: '',
    contactNumber: '',
    feeReceipt: '',
    vb: '',
    feeAmount: 0,
    accommodation: '',
  };
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type:'',
    Websitelink:'',
    contribution:'',
    role: '',
    email: '',
    contactNumber: '',
    feeReceipt: '',
    vb: '',
    feeAmount: 0,
    accommodation: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
   
  };

  const handletype = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormData((prevData) => ({
      ...prevData,
      feeAmount: 0,
    }));
    setFormData((prevData) => ({
      ...prevData,
      role: '',
    }));
  };
  const handlevb = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormData((prevData) => ({
      ...prevData,
      feeAmount: 0,
    }));
    setFormData((prevData) => ({
      ...prevData,
      role: '',
    }));
  };
  
  const handleRole = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    console.log(formData.vb)
    if(formData.vb==="nvb"){
    if (value === 'teacher' ) {
        setFormData((prevData) => ({
          ...prevData,
          feeAmount: 1000,
        }));
    }
    else  if (value === 'principle' ) {
      setFormData((prevData) => ({
        ...prevData,
        feeAmount: 2000,
      }));
  }
  else  if (value === 'dirVcCP' ) {
    setFormData((prevData) => ({
      ...prevData,
      feeAmount: 3000,
    }));
}
else  if (value === 'DelegatesFromIndustry' ) {
  setFormData((prevData) => ({
    ...prevData,
    feeAmount: 8000,
  }));
}
else  if (value === 'ResearchScholar' ) {
  setFormData((prevData) => ({
    ...prevData,
    feeAmount: 2000,
  }));
}
    else {
      setFormData((prevData) => ({
        ...prevData,
        feeAmount: 0,
      }));
    }
  }
    else {
      setFormData((prevData) => ({
        ...prevData,
        feeAmount: 0,
      }));
    }
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
        registrationType: 'Delegate Registration',
        data: {
          ...formData,
          fullName: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          institution: formData.name,
          accommodationRequired: formData.accommodation === 'Yes' ? 'Yes' : 'No',
          registrationFee: formData.feeAmount,
        },
        file: image,
        uploadFolder: 'delegate',
        fileField: 'feeReceipt',
      });
      toast.success("Suceessfully Registered!");
      setFormData(initialFormData);
      setImage(null);
    } catch (error) {
      toast.error("Something broke while registration!");
      console.error('Error submitting registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationFormWrapper heading="Participant Registration">
      <form onSubmit={handleSubmit} className='bg-white p-4'>
     
        {/* Name Field */}
       
        <div className='mb-4'>
        
          <label className='block text-sm font-medium text-gray-600'>
            Type<span className="text-red-700 text-base"><sup>&#42;</sup></span>
            <select
              name='type'
              value={formData.type}
              onChange={handletype}
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
              onClick={() => window.open('/accommodation', '_blank')}  // Replace with actual booking link
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
                  onChange={handlevb}
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
                  onChange={handleRole}
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
                  <Image className='p-2 h-50 w-50' src='/fee.png' alt='Fee' width={200} height={200} />
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

            {imageUrl && (
              <Image
                src={imageUrl}
                alt='Uploaded'
                width={800}
                height={600}
                unoptimized
                className="max-w-full h-auto"
              />
            )}
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
                  onChange={handleRole}
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
                  <Image className='p-2' src='/fee.png' alt='Fee' width={200} height={200} />
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

            {imageUrl && (
              <Image
                src={imageUrl}
                alt='Uploaded'
                width={800}
                height={600}
                unoptimized
                className="max-w-full h-auto"
              />
            )}
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
    </RegistrationFormWrapper>
  );
};

export default RegistrationForm;
