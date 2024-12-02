"use client";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase"; // Your Firebase configuration
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const ALLOWED_EMAILS = ["er.yogeshjangra1@gmail.com", "ykj131@gmail.com"];

const AddSpeakerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [place, setPlace] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editSpeakerId, setEditSpeakerId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Monitor auth state changes
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const email = currentUser.email;
        if (ALLOWED_EMAILS.includes(email || "")) {
          setUser(currentUser);
          setIsAuthorized(true);
        } else {
          // Sign out the user if the email is not allowed
          signOut(auth);
          setUser(null);
          setIsAuthorized(false);
          setErrorMessage("Access denied. Your email is not authorized.");
        }
      } else {
        setUser(null);
        setIsAuthorized(false);
      }
    });
  }, []);

  // Fetch speakers from Firestore
  useEffect(() => {
    const fetchSpeakers = async () => {
      const querySnapshot = await getDocs(collection(db, "keynotespeakers1"));
      setSpeakers(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchSpeakers();
  }, []);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      // Popup should be triggered by a button click event
      await signInWithPopup(auth, provider);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      // Show error message to the user
    }
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSuccessMessage("Signed out successfully.");
    } catch (error) {
      console.error("Sign-out error:", error);
      setErrorMessage("Sign-out failed. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setErrorMessage("Please upload an image.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(storage, `keynotespeakers1/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      if (isEditing && editSpeakerId) {
        const speakerRef = doc(db, "keynotespeakers1", editSpeakerId);
        await updateDoc(speakerRef, {
          name,
          designation,
          place,
          imageSrc: imageUrl,
        });
        setSuccessMessage("Speaker updated successfully!");
        setIsEditing(false);
        setEditSpeakerId(null);
      } else {
        await addDoc(collection(db, "keynotespeakers1"), {
          name,
          designation,
          place,
          imageSrc: imageUrl,
        });
        setSuccessMessage("Speaker added successfully!");
      }

      setName("");
      setDesignation("");
      setPlace("");
      setImageFile(null);
      setUploading(false);
    } catch (error) {
      setErrorMessage("Failed to add/update speaker. Please try again.");
      setUploading(false);
    }
  };

  // Edit speaker
  const handleEdit = (speaker: any) => {
    setName(speaker.name);
    setDesignation(speaker.designation);
    setPlace(speaker.place);
    setIsEditing(true);
    setEditSpeakerId(speaker.id);
  };

  // Delete speaker
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "keynotespeakers1", id));
      setSpeakers(speakers.filter((speaker) => speaker.id !== id));
      setSuccessMessage("Speaker deleted successfully!");
    } catch (error) {
      setErrorMessage("Failed to delete speaker. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-lg bg-black text-white mx-auto ">
      <h2 className="text-2xl  text-white font-bold text-center mb-4">Add/Edit Keynote speaker</h2>

      {!user ? (
        <div className="bg-white min-h-screen flex items-center">
          <button onClick={handleGoogleSignIn} className="bg-primary flex justify-center m-auto  items-center text-white py-2 px-4 rounded-lg">
            Sign in with Google
          </button>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
      ) : (
        <>
          <div className="text-right">
            <button onClick={handleSignOut} className="bg-red-600 text-white py-2 px-4 rounded mb-4">
              Sign Out
            </button>
          </div>

          {isAuthorized ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div>
                  <label className="block text-primary font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border text-black border-gray-300 rounded"
                    placeholder="Enter speaker name"
                  />
                </div>

                <div>
                  <label className="block text-primary font-bold mb-2" htmlFor="designation">
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                    className="w-full p-2 border text-black border-gray-300 rounded"
                    placeholder="Enter designation"
                  />
                </div>

                <div>
                  <label className="block text-primary font-bold mb-2" htmlFor="place">
                    Place
                  </label>
                  <input
                    type="text"
                    id="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    required
                    className="w-full p-2 border text-black border-gray-300 rounded"
                    placeholder="Enter place"
                  />
                </div>

                <div>
                  <label className="block text-primary font-bold mb-2" htmlFor="imageFile">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!isEditing}
                    className="w-full p-2 border text-black border-gray-300 rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : isEditing ? "Update Speaker" : "Add Speaker"}
                </button>
              </form>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Speakers List</h3>
                <ul className="space-y-4">
                  {speakers.map((speaker) => (
                    <li key={speaker.id} className="p-4 border rounded flex justify-between items-center">
                      <div>
                        <p className="font-bold">{speaker.name}</p>
                        <p>{speaker.designation}</p>
                        <p>{speaker.place}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEdit(speaker)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(speaker.id)}
                          className="bg-red-500 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-red-500">Access denied. Your email is not authorized.</p>
          )}
        </>
      )}
    </div>
  );
};

export default AddSpeakerForm;
