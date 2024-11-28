'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  type: string
  Websitelink: string
  contribution: string
  role: string
  email: string
  contactNumber: string
  feeReceipt: string
  vb: string
  feeAmount: number
  accommodation: string
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
  }
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0]
    if (selectedImage) {
      setImage(selectedImage)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
  
    const formDataToSend = new FormData()
  
    // Use Object.entries() to iterate over the formData and append each key-value pair
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value)
    })
  
    // Append the image file if present
    if (image) {
      formDataToSend.append('feeReceipt', image)
    }
  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataToSend,
      })
  
      if (response.ok) {
        toast.success('Successfully Registered!')
        setFormData(initialFormData)
        setImage(null)
      } else {
        toast.error('Something went wrong!')
      }
    } catch (error) {
      toast.error('Error during registration')
      console.error('Error during registration:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="shadow-md rounded-md max-w-md mx-auto mt-8">
      <h1 className="text-primary text-center text-xl">Participant Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4">
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Type</option>
            <option value="speaker">Speaker</option>
            <option value="attendee">Attendee</option>
            <option value="sponsor">Sponsor</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contactNumber" className="block font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feeReceipt" className="block font-medium text-gray-700">
            Fee Receipt (Upload)
          </label>
          <input
            type="file"
            id="feeReceipt"
            name="feeReceipt"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feeAmount" className="block font-medium text-gray-700">
            Fee Amount
          </label>
          <input
            type="number"
            id="feeAmount"
            name="feeAmount"
            value={formData.feeAmount}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vb" className="block font-medium text-gray-700">
            VB
          </label>
          <input
            type="text"
            id="vb"
            name="vb"
            value={formData.vb}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Websitelink" className="block font-medium text-gray-700">
            Website Link
          </label>
          <input
            type="url"
            id="Websitelink"
            name="Websitelink"
            value={formData.Websitelink}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contribution" className="block font-medium text-gray-700">
            Contribution
          </label>
          <input
            type="text"
            id="contribution"
            name="contribution"
            value={formData.contribution}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="accommodation" className="block font-medium text-gray-700">
            Accommodation
          </label>
          <input
            type="text"
            id="accommodation"
            name="accommodation"
            value={formData.accommodation}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4 w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default RegistrationForm
