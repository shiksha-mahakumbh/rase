"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addDoc, collection, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup, signOut, getAuth, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/app/firebase"; // Adjust import based on your Firebase setup
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";

const allowedEmail = "kandarisonal21200@gmail.com";

const AddEventForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Array<{ id: string; title: string; date: string; imageUrl?: string }>>([]);
  const [showForm, setShowForm] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    auth.signOut(); // Ensure user is signed out on page load

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === allowedEmail) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{ id: string; title: string; date: string; imageUrl?: string }>;
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Error fetching events.");
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      if (loggedInUser.email === allowedEmail) {
        setUser(loggedInUser);
        toast.success("Successfully signed in with Google!");
      } else {
        toast.error("Unauthorized email address.");
        await signOut(auth); // Sign out the user if unauthorized
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast.error("Error signing in: " + errorMessage);
      console.error("Error signing in:", error);
    }
  };

  const handleUpload = async (file: File | null) => {
    if (file) {
      const storageRef = ref(storage, `files/${file.name}`); // Create a reference to 'files/{fileName}'

      try {
        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const url = await getDownloadURL(storageRef);
        setImageUrl(url); // Set the image URL for displaying and storing in Firestore
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file.");
      }
    }
  };

  const handleAddDocument = async () => {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        title,
        date, // Send date as YYYY-MM-DD
        imageUrl,
      });
      console.log("Document added with ID:", docRef.id);
      setLoading(false);

      // Reset the form fields
      setTitle("");
      setDate("");
      setImageUrl(null);

      fetchEvents(); // Refresh the events list

      toast.success("Event added successfully!");
    } catch (error) {
      setLoading(false);
      const errorMessage = (error as Error).message; // Type assertion
      toast.error("Error adding event: " + errorMessage);
      console.error("Error adding document:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (editEventId) {
      try {
        const eventRef = doc(db, "events", editEventId);
        await updateDoc(eventRef, {
          title: editTitle,
          date: editDate,
          imageUrl: editImageUrl || null, // Ensure imageUrl can be null
        });

        setEditEventId(null);
        setEditTitle("");
        setEditDate("");
        setEditImageUrl(null);
        fetchEvents(); // Refresh the events list
        toast.success("Event updated successfully!");
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error("Error updating event.");
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      fetchEvents(); // Refresh the events list
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Error deleting event.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !user) {
      toast.error("Please complete all fields and sign in.");
      return;
    }

    setLoading(true);
    await handleAddDocument();
  };

  if (!user) {
    return (
      <div className="text-center">
        <CompanyInfo />
        <NavBar />
        <button
          onClick={handleLogin}
          className="bg-primary mt-10 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  if (user.email !== allowedEmail) {
    return (
      <p className="text-center">
        You are not authorized to access this page. Only admin has rights.
      </p>
    );
  }

  return (
    <>
      <CompanyInfo />
      <NavBar />
      <motion.div
        className="text-primary border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl border-gray-100 bg-slate-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition mx-2"
          >
            Add Event
          </button>
          <button
            onClick={() => setShowManageEvents(!showManageEvents)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition mx-2"
          >
            Manage Events
          </button>
        </div>

        {showForm && (
          <motion.div
            className="text-primary border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl border-gray-100 bg-slate-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-center text-2xl font-medium mb-4">Add Event</h2>
            <form onSubmit={handleSubmit}>
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-lg font-medium mb-2" htmlFor="title">
                  Event Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-lg font-medium mb-2" htmlFor="date">
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </motion.div>

              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-lg font-medium mb-2" htmlFor="image">
                  Event Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files ? e.target.files[0] : null)}
                  className="border rounded-lg p-2 w-full"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Event" className="mt-4 max-w-full h-auto" />
                )}
              </motion.div>

              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition w-full"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Event"}
              </button>
            </form>
          </motion.div>
        )}

        {showManageEvents && (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border p-4 rounded-lg bg-white shadow-sm">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>Date: {event.date}</p>
                {event.imageUrl && <img src={event.imageUrl} alt="Event" className="mt-2 max-w-full h-auto" />}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditEventId(event.id);
                      setEditTitle(event.title);
                      setEditDate(event.date);
                      setEditImageUrl(event.imageUrl || null);
                      setShowForm(true);
                      setShowManageEvents(false);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editEventId && (
          <motion.div
            className="text-primary border rounded-lg px-8 py-6 mx-auto my-8 max-w-2xl border-gray-100 bg-slate-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-center text-2xl font-medium mb-4">Edit Event</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateEvent();
              }}
            >
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="editTitle">
                  Event Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="editDate">
                  Event Date
                </label>
                <input
                  type="date"
                  id="editDate"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="editImage">
                  Event Image
                </label>
                <input
                  type="file"
                  id="editImage"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files ? e.target.files[0] : null)}
                  className="border rounded-lg p-2 w-full"
                />
                {editImageUrl && (
                  <img src={editImageUrl} alt="Event" className="mt-4 max-w-full h-auto" />
                )}
              </div>

              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition w-full"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Event"}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default AddEventForm;