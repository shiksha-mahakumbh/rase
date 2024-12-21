"use client"
import React, { useEffect, useState } from "react";
import Guest from "../component/Guest";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "@/app/firebase";
const speakers = [

  {
    id: 1,
    name: "Prof. Abhay Kumar Singh",
    designation: "Vice Chancellor, Nalanda University",
    place: "The Hon'ble sir congratulates and wishes best for the event ",
    imageSrc: "/2024M/cheifguests/nalanda.jpg",
  },
  {
    id: 1,
    name: "Admiral D. K. Joshi, PVSM, AVSM, YSM, NM, VSM (Retd.)",
    designation: "Hon'ble Governor of Andaman & Nicobar Islands",
    place: "The Hon'ble Lt. Governor conveyed his Best wishes for success of the event",
    imageSrc: "/2024M/cheifguests/andaman.jpg",
  },
  {
    id: 1,
    name: " Lt. Gen. Kaiwalya Trivikram Parnaik, PVSM, UYSM, YSM (RETD.)",
    designation: "Hon'ble Governor of Arunachal Pradesh",
    place: "The Hon'ble Governor extends his Best wishes for success of the event",
    imageSrc: "/2024M/cheifguests/governer.jpg",
  },
  {
    id: 1,
    name: "Shri Rajendra Arlekar",
    designation: "Hon'ble Governor of Bihar",
    place: "माननीय राज्यपाल, बिहार के द्वारा शिक्षा महाकुंभ के द्वितीय संस्करण की कामयाबी के लिए शुभकामनाएँ व्यक्त की है",
    imageSrc: "/2024M/cheifguests/bihargovernor.png",
  },
  {
    id: 2,
    name: "Shri L. A. Ganesan",
    designation: "Hon'ble Governor of Nagaland",
    place: "Hon'ble Governor sends his best wishes for the success of the programme",
    imageSrc: "/2024M/cheifguests/nagalandgovernor.png",
  },
  {
    id: 3,
    name: "Dr. Brajesh Singh",
    designation: "Hon'ble Director, ICAR-CPRI",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/brajesh.png",
  },
  {
    id: 4,
    name: "Shri Giriraj Singh",
    designation: "Hon'ble Minister for Textiles",
    place: "Hon'ble Minister sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/girirajsingh.png",
  },
  {
    id: 5,
    name: "Dr. Anup Das",
    designation: "Hon'ble Director, ICAR Research Complex for Eastern Region",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/anupdas.png",
  },
  {
    id: 6,
    name: "Shri Vivek Bhasin",
    designation: "Hon'ble Director, BARC",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/barcdirector.png",
  },
  {
    id: 7,
    name: "Dr. (Mrs.) N. Kalaiselvi",
    designation: "Hon'ble Director General, CSIR & Secretary DSIR",
    place: "Hon'ble Director General sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgcsir.png",
  },
  {
    id: 8,
    name: "Dr. Gilliam",
    designation: "Hon'ble President, Boston University",
    place: "Hon'ble President sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/boston.png",
  },
  {
    id: 9,
    name: "Major General BK Sharma, AVSM, SM** (RETD.)",
    designation: "Hon'ble Director General, USI",
    place: "Hon'ble Director General sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgusi.png",
  },
  {
    id: 10,
    name: "Dr. S. Periyasamy",
    designation: "Hon'ble Director, CSTRI",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/cstridirector.png",
  },
];


const WishesReceived: React.FC = () => {
  const [firebaseSpeakers, setFirebaseSpeakers] = useState<any[]>([]);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    // Fetch data from Firebase Firestore
    const fetchSpeakers = async () => {
      const querySnapshot = await getDocs(collection(db, "wishesReceived")); // Use your collection name
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
      <p className="text-xl md:text-2xl text-primary text-center uppercase font-bold mb-4">Wishes Received for the success of Shiksha Mahakumbh 2024</p>
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

export default WishesReceived;
