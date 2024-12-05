import { ChangeEvent, useState } from "react";

const ConclaveForm = () => {
  const [formData, setFormData] = useState({
    typeofConclave: "",
    name: "",
    designation: "",
    institutionName: "",
    email: "",
    contactNumber: "",
    address: "",
    views: "",
  });

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/Conclave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        // Optionally, clear the form after successful submission
        setFormData({
          typeofConclave: "",
          name: "",
          designation: "",
          institutionName: "",
          email: "",
          contactNumber: "",
          address: "",
          views: "",
        });
      } else {
        alert("Error submitting form");
      }
    } catch (error) {
      alert("Network error");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Select Conclave Type:
          <select
            name="typeofConclave"
            value={formData.typeofConclave}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          >
            <option value="">Select Conclave Type</option>
            <option value="academic">VC/Directors&apos; Conclave</option>
            <option value="industry">Principals&apos; Conclave</option>
            <option value="research">Entrepreneurs/Bureaucrats&apos; Conclave</option>
            <option value="innovation">Student Leaders&apos; Conclave</option>
            <option value="academic">Scientists&apos; Conclave</option>
            <option value="industry">Social Media Influencers&apos; Conclave</option>
            <option value="research">Electronic and Print Media Conclave</option>
          </select>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Full Name:
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
          Designation:
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Institution/Organization Name:
          <input
            type="text"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
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
          Address:
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Your Views: (In 200 Words)
          <textarea
            name="views"
            value={formData.views}
            onChange={handleInputChange}
            required
            maxLength={200}
            className="mt-4 p-2 block w-full rounded-md border border-gray-300 text-black"
          />
        </label>
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
        <div className="mt-6 text-center">
  <h2>For Accomodation click the below button</h2>
  <button
    type="button"
    onClick={() => {
      window.location.href = "/Accomodation"; // Adjust path as needed
    }}
    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition duration-300"
  >
    Accommodation Booking
  </button>
</div>
      </div>
    </form>
  );
};

export default ConclaveForm;
