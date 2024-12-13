import { useState, ChangeEvent } from "react";
import axios from "axios";
import { InstitutionFormProps } from "../Types";

const InstitutionForm = ({
  formData,
  handleInputChange,
  handleRole,
  handleImageChange,
  imageUrl,
}: InstitutionFormProps) => {
  // State to manage form submission status (loading, success, error)
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Create a FormData object to send the form data (including file) to the backend
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("cont", formData.cont);
    formDataToSend.append("feeAmount", formData.feeAmount.toString());
    
    if (formData.feeAmount !== 0 && imageUrl) {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formDataToSend.append("feeReceipt", fileInput.files[0]);
      }
    }

    try {
      // Send the form data to the backend
      const response = await axios.post("http://localhost:5000/Institution", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setMessage("Institution data submitted successfully!");
    } catch (error) {
      console.error("Error submitting institution data:", error);
      setMessage("Failed to submit institution data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution Name:
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution Type:
          <select
            name="role"
            value={formData.role}
            onChange={handleRole}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Type</option>
            <option value="Academica">Academia</option>
            <option value="Industry">Industry</option>
            <option value="NGO">NGO/Society/Trust</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Contact Number:
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Website:
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Contribution:
          <input
            type="text"
            name="cont"
            value={formData.cont}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      {formData.feeAmount !== 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 ">
            Upload Fee Receipt:
            <input
              type="file"
              accept=".pdf, .png, .jpg"
              required={formData.feeAmount !== 0}
              onChange={handleImageChange}
              className="mt-4 p-2 block w-full rounded-md border-gray-300 text-black"
            />
          </label>
        </div>
      )}

      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />}

      <div className="mb-4">
        {loading ? (
          <button type="submit" disabled className="p-2 bg-gray-400 text-white rounded-md w-full">
            Submitting...
          </button>
        ) : (
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-md w-full">
            Submit
          </button>
        )}
      </div>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-gray-600">
          {message}
        </div>
      )}
    </form>
  );
};

export default InstitutionForm;
