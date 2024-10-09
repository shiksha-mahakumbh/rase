'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast from "react-hot-toast";

// Interfaces for different forms
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

interface NGOData {
  name: string;
  registrationNumber: string;
  email: string;
  website: string;
  phone: string;
  contribution: string;
  attachments: string;
}

interface ConclaveData {
  category: string;
  name: string;
  designation: string;
  institutionName: string;
  email: string;
  phone: string;
  address: string;
  views: string;
}

interface VolunteerData {
  name: string;
  affiliation: string;
  email: string;
  phone: string;
  services: string;
  resume: string;
}

const CombinedRegistrationForm = () => {
  // State hooks
  const [talentData, setTalentData] = useState<TalentData>({
    name: '',
    email: '',
    address: '',
    institution: '',
    category: '',
    class: '',
    description: '',
    attachments: '',
  });
  const [ngoData, setNgoData] = useState<NGOData>({
    name: '',
    registrationNumber: '',
    email: '',
    website: '',
    phone: '',
    contribution: '',
    attachments: '',
  });
  const [conclaveData, setConclaveData] = useState<ConclaveData>({
    category: '',
    name: '',
    designation: '',
    institutionName: '',
    email: '',
    phone: '',
    address: '',
    views: '',
  });
  const [volunteerData, setVolunteerData] = useState<VolunteerData>({
    name: '',
    affiliation: '',
    email: '',
    phone: '',
    services: '',
    resume: '',
  });

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [formType, setFormType] = useState<'talent' | 'ngo' | 'conclave' | 'volunteer'>('talent');

  // Handling input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (formType === 'talent') {
      setTalentData((prevData) => ({ ...prevData, [name]: value }));
    } else if (formType === 'ngo') {
      setNgoData((prevData) => ({ ...prevData, [name]: value }));
    } else if (formType === 'conclave') {
      setConclaveData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setVolunteerData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handling file uploads
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  // Function to add documents
  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const dataToSubmit =
        formType === 'talent' ? { ...talentData, attachments: downloadURL } :
        formType === 'ngo' ? { ...ngoData, attachments: downloadURL } :
        formType === 'conclave' ? { ...conclaveData } :
        { ...volunteerData, resume: downloadURL };

      const collectionName = formType === 'talent' ? 'TalentRegistration' :
                             formType === 'ngo' ? 'NGORegistration' :
                             formType === 'conclave' ? 'ConclaveRegistration' :
                             'VolunteerRegistration';

      const docRef = await addDoc(collection(db, collectionName), dataToSubmit);
      console.log('Document added with ID:', docRef.id);
      setLoading(false);
      resetForm();
      toast.success("Successfully Registered!");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong during registration!");
      console.error('Error adding document:', error);
    }
  };

  // Handling form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (image) {
      try {
        const imageRef = ref(storage, `uploads/${image.name}`);
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
  };

  // Resetting form data
  const resetForm = () => {
    setTalentData({ name: '', email: '', address: '', institution: '', category: '', class: '', description: '', attachments: '' });
    setNgoData({ name: '', registrationNumber: '', email: '', website: '', phone: '', contribution: '', attachments: '' });
    setConclaveData({ category: '', name: '', designation: '', institutionName: '', email: '', phone: '', address: '', views: '' });
    setVolunteerData({ name: '', affiliation: '', email: '', phone: '', services: '', resume: '' });
    setImage(null);
  };

  return (
    <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
      <h1 className='text-primary text-center text-2xl font-bold mb-4'>Combined Registration Form</h1>
      <div className="flex justify-center mb-4">
        <button className={`px-4 py-2 rounded-md ${formType === 'talent' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mx-2`} onClick={() => setFormType('talent')}>Talent</button>
        <button className={`px-4 py-2 rounded-md ${formType === 'ngo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mx-2`} onClick={() => setFormType('ngo')}>NGO</button>
        <button className={`px-4 py-2 rounded-md ${formType === 'conclave' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mx-2`} onClick={() => setFormType('conclave')}>Conclave</button>
        <button className={`px-4 py-2 rounded-md ${formType === 'volunteer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mx-2`} onClick={() => setFormType('volunteer')}>Volunteer</button>
      </div>

      <form onSubmit={handleSubmit} className='bg-white p-6 rounded-md'>
        {formType === 'talent' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" name="name" value={talentData.name} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={talentData.email} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address:</label>
              <input type="text" name="address" value={talentData.address} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Institution:</label>
              <input type="text" name="institution" value={talentData.institution} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category:</label>
              <select name="category" value={talentData.category} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {talentData.category === 'Student' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Class:</label>
                <input type="text" name="class" value={talentData.class} onChange={handleInputChange} className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea name="description" value={talentData.description} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Attachments:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>
          </>
        )}

        {formType === 'ngo' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" name="name" value={ngoData.name} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
              <input type="text" name="registrationNumber" value={ngoData.registrationNumber} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={ngoData.email} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Website:</label>
              <input type="text" name="website" value={ngoData.website} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="text" name="phone" value={ngoData.phone} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contribution:</label>
              <textarea name="contribution" value={ngoData.contribution} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Attachments:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>
          </>
        )}

        {formType === 'conclave' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Category:</label>
              <input type="text" name="category" value={conclaveData.category} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" name="name" value={conclaveData.name} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Designation:</label>
              <input type="text" name="designation" value={conclaveData.designation} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Institution Name:</label>
              <input type="text" name="institutionName" value={conclaveData.institutionName} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={conclaveData.email} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="text" name="phone" value={conclaveData.phone} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address:</label>
              <textarea name="address" value={conclaveData.address} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Views:</label>
              <textarea name="views" value={conclaveData.views} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"></textarea>
            </div>
          </>
        )}

        {formType === 'volunteer' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" name="name" value={volunteerData.name} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Affiliation:</label>
              <input type="text" name="affiliation" value={volunteerData.affiliation} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="email" value={volunteerData.email} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="text" name="phone" value={volunteerData.phone} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Services:</label>
              <textarea name="services" value={volunteerData.services} onChange={handleInputChange} required className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500"></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Resume:</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-500" />
            </div>
          </>
        )}

        <div className="mt-6">
          <button type="submit" className="w-full rounded-md bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CombinedRegistrationForm;
