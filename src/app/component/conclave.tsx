'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import toast from "react-hot-toast";

interface ConclaveData {
    category: string;
    name: string;
    designation: string;
    institutionName: string;
    email: string;
    number: string;
    address: string;
    views: string;
}

const ConclaveReg = () => {
    const initialFormData: ConclaveData = {
        category: '',
        name: '',
        designation: '',
        institutionName: '',
        email: '',
        number: '',
        address: '',
        views: ''
    };

    const [formData, setFormData] = useState<ConclaveData>(initialFormData);
    const [loading, setLoading] = useState(false); // Add loading state

    // Updated handleInputChange function to handle all types of inputs, selects, and textareas
    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const docRef = await addDoc(collection(db, 'ConclaveRegistration'), formData);
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

    return (
        <div className='shadow-md rounded-md max-w-md mx-auto mt-8'>
            <h1 className='text-primary text-center text-xl'>Conclave Registration Form</h1>
            <form onSubmit={handleSubmit} className='bg-white p-4'>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600">Select Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                    >
                        <option value="">Select a category</option>
                        <option value="Principal">Principal</option>
                        <option value="VC/Director">VC/Director</option>
                        <option value="Bureaucrates">Bureaucrates</option>
                        <option value="Entrepreneurs">Entrepreneurs</option>
                        <option value="Scientists">Scientists</option>
                    </select>
                </div>
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
                    <label className="block text-sm font-medium text-gray-600">Designation:</label>
                    <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                    />
                </div>
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
                    <label className="block text-sm font-medium text-gray-600">Number:</label>
                    <input
                        type="tel"
                        name="number"
                        value={formData.number}
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
                    <label className="block text-sm font-medium text-gray-600">Write your views (200 words):</label>
                    <textarea
                        name="views"
                        value={formData.views}
                        onChange={handleInputChange} // This now works for textarea as well
                        required
                        className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
                        rows={5}
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
};

export default ConclaveReg;
