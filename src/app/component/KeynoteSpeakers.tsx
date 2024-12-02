"use client"
import React, { useEffect, useState } from "react";
import Guest from "./Guest";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "@/app/firebase";

const speakers = [
  
  {
    id: 1,
    name: "Dr. Sharanjeet Kaur",
    designation: "CHAIRPERSON",
    place: "RCI",
    imageSrc: "/keynotespeakers/rcichairperson.png",
  },
  {
    id: 2,
    name: "Shri Amogh Lila Das",
    designation: "Vice-President",
    place: "ISKCON Dwarka",
    imageSrc: "/keynotespeakers/iskconvp.png",
  },
  {
    id: 3,
    name: "Advocate Ashwini Upadhyay",
    designation: "Activist and Lawyer",
    place: "Supreme Court",
    imageSrc: "/keynotespeakers/ashwini.jpg",
  },
  {
    id: 4,
    name: "Justice Hemant Gupta",
    designation: "Former Judge",
    place: "Supreme Court",
    imageSrc: "/keynotespeakers/justicehemantgupta.jpg",
  },

];




const KeynoteSpeakers: React.FC = () => {
  const [firebaseSpeakers, setFirebaseSpeakers] = useState<any[]>([]);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    // Fetch data from Firebase Firestore
    const fetchSpeakers = async () => {
      const querySnapshot = await getDocs(collection(db, "keynotespeakers1")); // Use your collection name
      const fetchedSpeakers: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedSpeakers.push({ id: doc.id, ...doc.data() });
      });
      setFirebaseSpeakers(fetchedSpeakers);
    };
  
    fetchSpeakers();
  }, []);

  return (
    <div className="p-4">
      <div className="p-4">
        <p className="text-2xl text-red-800 text-center uppercase font-bold mb-4">
          KeyNote Speakers
        </p>
        <div className="flex flex-wrap">
          {/* Hardcoded speakers */}
          {speakers.map((guest) => (
            <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <Guest {...guest} />
            </div>
          ))}

          {/* Firebase speakers */}
          {firebaseSpeakers.map((guest) => (
            <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <Guest {...guest} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeynoteSpeakers;
