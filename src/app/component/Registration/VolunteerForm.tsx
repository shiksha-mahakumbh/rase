'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast, { Toaster } from "react-hot-toast";

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

  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, 'RegestrationVolsm24'), {
        ...formData,
        feeReceipt: downloadURL,
      });
      console.log('Document added with ID:', docRef.id);
      setLoading(false);
      setFormData(initialFormData);
      toast.success("Successfully Registered!");

      if (formData.accommodation === 'yes') {
        setShowAccommodationButton(true); // Show the button if 'Yes' is selected
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something broke while registering!");
      console.error('Error adding document:', error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (image) {
      try {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);
        handleAddDocument(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
      }
    } else {
      handleAddDocument(null);
    }

    console.log(formData);
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
    </div>
  );
};

export default VolReg;
