"use client";
import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { db } from "@/app/firebase"; // Adjust the import based on your Firebase setup

const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [event, setEvent] = useState('');
  const [experience, setExperience] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddDocument = async (downloadURL: string | null) => {
    try {
      const docRef = await addDoc(collection(db, "Feedback"), {
        name,
        email,
        mobile,
        affiliation,
        event,
        experience,
        suggestions,
        Attachments: downloadURL || "", 
      });
      console.log("Document added with ID:", docRef.id);
      setLoading(false);

      // Reset the form fields
      setName('');
      setEmail('');
      setMobile('');
      setAffiliation('');
      setEvent('');
      setExperience('');
      setSuggestions('');

      toast.success("Thank you for your Feedback! Your Feedback means a lot to us.");
    } catch (error) {
      setLoading(false);
      toast.error("Something broke while submitting the feedback");
      console.error("Error adding document:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !mobile || !affiliation || !event) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    // Simulate downloadURL; replace with your actual logic
    const downloadURL = null; // Replace with actual download URL if needed

    await handleAddDocument(downloadURL);
  };

  return (
    <motion.div
      className="text-primary border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl border-gray-100 bg-slate-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <h2 className=" text-center text-2xl font-medium mb-4">Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'mobile', 'affiliation'].map((field, index) => (
          <motion.div
            key={field}
            className="mb-4 moving-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
          >
            <label htmlFor={field} className="block text-gray-700 font-medium mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <span className="text-red-500">*</span>
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              id={field}
              name={field}
              value={eval(field)}
              onChange={(e) => eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}(e.target.value)`)}
              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
              required
            />
          </motion.div>
        ))}
        <motion.div
          className="mb-4 moving-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label htmlFor="event" className="block text-gray-700 font-medium mb-2">
            Select the event you participated in
            <span className="text-red-500">*</span>
          </label>
          <select
            id="event"
            name="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            required
          >
            <option value="">Select event</option>
            <option value="shiksha-kumbh-2023">शिक्षा कुंभ 2023</option>
            <option value="shiksha-kumbh-2024">शिक्षा कुंभ 2024</option>
            <option value="shiksha-mahakumbh-2023">शिक्षा महाकुंभ 2023</option>
            <option value="shiksha-mahakumbh-2024">शिक्षा महाकुंभ 2024</option>
          </select>
        </motion.div>
        <motion.div
          className="mb-4 moving-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">Write Your Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            rows={5}
            required
          />
        </motion.div>
        <motion.div
          className="mb-4 moving-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <label htmlFor="suggestions" className="block text-gray-700 font-medium mb-2">Provide Your Suggestions to Make This Abhiyan a World Class</label>
          <textarea
            id="suggestions"
            name="suggestions"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            rows={5}
          />
        </motion.div>
        <div className='flex items-center justify-center'>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
