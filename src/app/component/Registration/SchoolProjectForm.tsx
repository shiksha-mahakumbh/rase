"use client";
import React, { useState } from "react";
import { db, storage } from "../../firebase"; // Adjust the path based on your setup
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

const SchoolProjectForm: React.FC = () => {
  const [teamSize, setTeamSize] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [participants, setParticipants] = useState<
    { name: string; phone: string; email: string; class: string; }[]
  >([{ name: "", phone: "", email: "", class: "", }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    schoolName: "",
    schoolAddress: "",
    projectPpt: null as File | null,
    projectVideo: null as File | null,
    feeUpload: null as File | null,
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle team size change
  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value);
    setTeamSize(size);
    setParticipants(Array(size).fill({ name: "", phone: "", email: "" }));
  };
  

  // Handle participant changes
  const handleParticipantChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value,
    };
    setParticipants(updatedParticipants);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  // File upload to Firebase Storage
  const uploadFile = (file: File, path: string) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate all fields are filled
      if (
        !formData.projectName ||
        !formData.projectDescription ||
        !formData.schoolName ||
        !formData.schoolAddress ||
        !formData.projectPpt ||
        !formData.projectVideo ||
        !formData.feeUpload
      ) {
        toast.error("All fields are required.");
        setLoading(false);
        return;
      }

      // Upload files
      const pptPath = `heiProjects/${formData.projectName}/ppt`;
      const videoPath = `heiProjects/${formData.projectName}/video`;
      const feePath = `heiProjects/${formData.projectName}/feeReceipt`;

      const [pptUrl, videoUrl, feeUrl] = await Promise.all([
        uploadFile(formData.projectPpt!, pptPath),
        uploadFile(formData.projectVideo!, videoPath),
        uploadFile(formData.feeUpload!, feePath),
      ]);

      // Store form data in Firestore
      const docRef = await addDoc(collection(db, "SchoolProjectFormdata"), {
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        schoolName: formData.schoolName,
        schoolAddress: formData.schoolAddress,
        teamSize: teamSize,
        participants: participants,
        projectPptUrl: pptUrl,
        projectVideoUrl: videoUrl,
        feeReceiptUrl: feeUrl,
      });

      toast.success("Project submitted successfully!");
      setFormData({
        projectName: "",
        projectDescription: "",
        schoolName: "",
        schoolAddress: "",
        projectPpt: null,
        projectVideo: null,
        feeUpload: null,
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("Failed to submit the form.");
    }

    setLoading(false);
  };

  const faqData = [
    {
      question: "How many members can be in a team?",
      answer: "Minimum 1 member and maximum 4 members.",
    },
    {
      question: "Is the project working or just an idea?",
      answer: "The project should be in working condition.",
    },
    {
      question: "Are there any prizes?",
      answer: "Yes, there will be prizes for appreciation.",
    },
    {
      question: "What are the submission deadlines?",
      answer: "Submissions must be received by the end of the month.",
    },
    {
      question: "Can we use third-party libraries?",
      answer: "Yes, using third-party libraries is allowed as long as they do not violate any competition rules.",
    },
    {
      question: "Where can we get more information?",
      answer: "You can contact us via email for more information.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">
        Project Display Registraion for School
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Name <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Description{" "}
            <span className="text-red-500">(max 400 words)*</span>
          </label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
            required
          />
        </div>

        {/* Project PPT Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project PPT Upload <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="file"
            name="projectPpt"
            onChange={handleFileChange}
            accept=".ppt, .pptx"
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            required
          />
          {loading && formData.projectPpt && (
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Max size: 40 MB</p>
        </div>

        {/* Project Video Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Project Video Upload <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="file"
            name="projectVideo"
            onChange={handleFileChange}
            accept="video/*"
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            required
          />
          {loading && formData.projectVideo && (
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Max size: 40 MB</p>
        </div>

        {/* school Name */}
       
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            School Name <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* school Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            School Address <span className="text-red-500">&#42;</span>
          </label>
          <textarea
            name="schoolAddress"
            value={formData.schoolAddress}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            required
          />
        </div>

        {/* Team Size */}
        <div>
  <label className="block text-sm font-semibold text-gray-700">
    Select Team Size
  </label>
  <select
    value={teamSize} // teamSize state will control the selected option
    onChange={handleTeamSizeChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  >
    <option value={0}>Select Team Size</option>
    <option value={1}>1</option>
    <option value={2}>2</option>
    <option value={3}>3</option>
    <option value={4}>4</option>
  </select>
</div>


        {/* Participants */}
        {[...Array(teamSize)].map((_, index) => (
          <div key={index} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Participant {index + 1} Name
              </label>
              <input
                type="text"
                value={participants[index]?.name}
                onChange={(e) =>
                  handleParticipantChange(index, "name", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Participant {index + 1} Phone Number
              </label>
              <input
                type="tel"
                value={participants[index]?.phone}
                onChange={(e) =>
                  handleParticipantChange(index, "phone", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Participant {index + 1} Email ID
              </label>
              <input
                type="email"
                value={participants[index]?.email}
                onChange={(e) =>
                  handleParticipantChange(index, "email", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
          <label className="block text-sm font-semibold text-gray-700">
            Participant {index + 1} Class Name 
          </label>
          <input
                type="text"
                value={participants[index]?.class}
                onChange={(e) =>
                  handleParticipantChange(index, "class", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
        </div>
          </div>
        ))}

        {/* Fee Section */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold text-gray-700">
            Fee: &#8360; 200
          </span>
          <img src="/fee.png" alt="QR Code" className="w-24 h-24" />
        </div>

        {/* Fee Receipt Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Fee Receipt Upload <span className="text-red-500">&#42;</span>
          </label>
          <input
            type="file"
            name="feeUpload"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
            required
          />
          {loading && formData.feeUpload && (
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-gradient-to-l focus:ring focus:ring-offset-1 focus:ring-indigo-600 transition duration-300 ease-in-out"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
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
      </form>
      <div className="mt-8 bg-black p-6 rounded-md shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-white mb-4">FAQ</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center py-3 px-4 text-left text-white font-semibold focus:outline-none"
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-4 py-2 text-primary">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolProjectForm;
