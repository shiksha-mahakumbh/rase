'use client'
import { useState,useEffect, ChangeEvent, FormEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import  toast , { Toaster } from "react-hot-toast";
interface NgoData {
    name: string;
    RegistrationNo: string;
    email: string;
    Website: string;
    PhoneNumber: string;
    Contribution: string;
    Attachments: string;
  }
  
const NGOReg = () => {
    const initialFormData: NgoData = {
        name: '',
        RegistrationNo: '',
        email: '',
        Website: '',
        PhoneNumber: '',
        Contribution: '',
        Attachments: '',
      };
    const [formData, setFormData] = useState<NgoData>({
        name: '',
        RegistrationNo: '',
        email: '',
        Website: '',
        PhoneNumber: '',
        Contribution: '',
        Attachments: '',
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
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };
  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, 'RegestrationNGO'), { ...formData, feeReceipt: downloadURL });
      console.log('Document added with ID:', docRef.id);
      setLoading(false);
      setFormData(initialFormData)
      toast.success("Suceessfully Registered!");
    } catch (error) {
      setLoading(false);
      toast.error("Something broke while registration!")
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

        // Update formData with the download URL
        setFormData((prevData) => ({
          ...prevData,
          feeReceipt: downloadURL || '', // Use an empty string if downloadURL is undefined
        }));

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

    // Perform actions with the form data and updated image URL
    console.log(formData);
  };
  return (
    <div className=' shadow-md rounded-md max-w-md mx-auto mt-8'> 
    <h1 className='text-primary text-center text-xl '>NGO Registration Form</h1>
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
        <label className="block text-sm font-medium text-gray-600">Registration Number:</label>
        <input
          type="text"
          name="RegistrationNo"
          value={formData.RegistrationNo}
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
        <label className="block text-sm font-medium text-gray-600">Website:</label>
        <input
          type="text"
          name="Website"
          value={formData.Website}
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
        <label className="block text-sm font-medium text-gray-600">Contribution:</label>
        <input
          name="Contribution"
          value={formData.Contribution}
          onChange={handleInputChange}
          required
          className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
        />
      </div>

    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Attachments:</label>
        <input
          type="file"
          name="Attachments"
          accept=".pdf, .png, .jpg"
          onChange={handleImageChange}
          className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black "

        />
      </div>
      <input
    type="file"
    accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  />
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
        disabled={loading} // Disable the button when loading
      >
        Submit
      </button> </form>
    </div>
  )
}

export default NGOReg