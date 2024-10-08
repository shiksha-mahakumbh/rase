'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast from "react-hot-toast";

interface TalentData {
  name: string;
  email: string;
  address: string;
  institution: string;
  category: string;
  class?: string; // Optional, for students only
  description: string;
  attachments: string;
}

const TalentReg = () => {
  const initialFormData: TalentData = {
    name: '',
    email: '',
    address: '',
    institution: '',
    category: '',
    class: '',
    description: '',
    attachments: '',
  };

  const [formData, setFormData] = useState<TalentData>(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, 'TalentRegistration'), { ...formData, attachments: downloadURL });
      console.log('Document added with ID:', docRef.id);
      setLoading(false);
      setFormData(initialFormData);
      toast.success("Successfully Registered!");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong during registration!");
      console.error('Error adding document:', error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Upload image if it exists
    if (image) {
      try {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        
        // Get download URL using a Promise
        const downloadURL = await getDownloadURL(imageRef);
        
        // Add document to Firestore
        handleAddDocument(downloadURL);
      } catch (error) {
        console.error('Error uploading image:', error);
        setLoading(false);
      }
    } else {
      // Add document to Firestore without image
      handleAddDocument(null);
    }
  };

  return (
    <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
      <h1 className='text-primary text-center text-xl'>Talent Registration Form</h1>
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
          <label className="block text-sm font-medium text-gray-600">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Institution:</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="" disabled>Select your category</option>
            <option value="principal">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        {formData.category === 'student' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Class:</label>
            <input
              type="text"
              name="class"
              value={formData.class || ''}
              onChange={handleInputChange}
              required
              className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description (200 words):</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            maxLength={200}
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
            rows={5}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Upload Documents of Achievements:</label>
          <input
            type="file"
            name="attachments"
            accept=".pdf, .doc, .docx, .png, .jpg"
            onChange={handleImageChange}
            className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading} // Disable the button when loading
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default TalentReg;
