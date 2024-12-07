'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast, { Toaster } from "react-hot-toast";

interface BestPracticeData {
  institutionName: string;
  aboutPractices: string;
  keyPerson: string;
  email: string;
  contactNumber: string;
  address: string;
  attachmentURL: string;
  accommodation: string; // Field for accommodation preference
}

const BestPracticesForm = () => {
  const initialFormData: BestPracticeData = {
    institutionName: '',
    aboutPractices: '',
    keyPerson: '',
    email: '',
    contactNumber: '',
    address: '',
    attachmentURL: '',
    accommodation: '', // Initialize empty
  };

  const [formData, setFormData] = useState<BestPracticeData>(initialFormData);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAccommodationButton, setShowAccommodationButton] = useState(false); // To show the booking button

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setAttachment(selectedFile);
    }
  };

  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, 'BestPractices'), {
        ...formData,
        attachmentURL: downloadURL,
      });
      console.log('Document added with ID:', docRef.id);
      setLoading(false);
      setFormData(initialFormData);
      setAttachment(null);
      toast.success("Best Practice Submitted Successfully!");

      if (formData.accommodation === 'yes') {
        setShowAccommodationButton(true); // Show the button if 'Yes' is selected
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error while submitting the form!");
      console.error('Error adding document:', error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (attachment) {
      try {
        const fileRef = ref(storage, `attachments/${attachment.name}`);
        await uploadBytes(fileRef, attachment);
        const downloadURL = await getDownloadURL(fileRef);
        handleAddDocument(downloadURL);
      } catch (error) {
        console.error('Error uploading attachment:', error);
        setLoading(false);
      }
    } else {
      handleAddDocument(null);
    }
  };

  return (
    <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
      <h1 className='text-primary text-center text-xl'>Submit Best Practices</h1>
      <form onSubmit={handleSubmit} className='bg-white p-4'>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Institution Name:</label>
          <input
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">About Practices (250 words):</label>
          <textarea
            name="aboutPractices"
            value={formData.aboutPractices}
            onChange={handleInputChange}
            maxLength={250}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Key Person:</label>
          <input
            type="text"
            name="keyPerson"
            value={formData.keyPerson}
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
          <label className="block text-sm font-medium text-gray-600">Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Upload Attachment (Optional):</label>
          <input
            type="file"
            name="attachment"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
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
          {loading ? "Submitting..." : "Submit"}
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

export default BestPracticesForm;
