"use client"
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter as faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/app/firebase";
import { doc, onSnapshot, updateDoc, getDoc, increment, setDoc } from "firebase/firestore";
import { Spin } from 'antd'; 


const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [dailyVisitors, setDailyVisitors] = useState<number | null>(null);
  const [totalVisitors, setTotalVisitors] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 
  
  useEffect(() => {
    const totalDocRef = doc(db, "visitors", "total");
    const dailyDocRef = doc(db, "visitors", "daily");
    const yesterdayDocRef = doc(db, "visitors", "yesterday");

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    const resetDailyCount = async () => {
      try {
        const dailyDocSnap = await getDoc(dailyDocRef);
        
        if (dailyDocSnap.exists()) {
          const dailyData = dailyDocSnap.data();

          if (dailyData.date !== today) {
            // Store the previous day's count
            await setDoc(yesterdayDocRef, { count: dailyData.count, date: dailyData.date });

            // Reset daily count for the new day
            await setDoc(dailyDocRef, { count: 0, date: today });
          }
        }
      } catch (error) {
        console.error("Error resetting daily visitor count:", error);
      }
    };

    const updateVisitorCount = async () => {
      try {
        const totalDocSnap = await getDoc(totalDocRef);
        const dailyDocSnap = await getDoc(dailyDocRef);

        // Initialize total and daily counts if they don't exist
        if (!totalDocSnap.exists()) {
          await setDoc(totalDocRef, { count: 0 });
        }
        if (!dailyDocSnap.exists()) {
          await setDoc(dailyDocRef, { count: 0, date: today });
        } else {
          const dailyData = dailyDocSnap.data();
          if (dailyData.date !== today) {
            await resetDailyCount();
          }
        }

        // Increment counts
        await updateDoc(totalDocRef, { count: increment(1) });
        await updateDoc(dailyDocRef, { count: increment(1) });

        console.log("Visitor count updated successfully.");
      } catch (error) {
        console.error("Error updating visitor counts:", error);
      }
    };

    updateVisitorCount();

    const unsubscribeTotal = onSnapshot(totalDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTotalVisitors(data.count);
        setLoading(false); 
      }
    });

    const unsubscribeDaily = onSnapshot(dailyDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDailyVisitors(data.count);
        setLoading(false); 
      }
    });

    // Schedule the daily reset at midnight
    const now = new Date();
    const timeUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime();

    const resetAtMidnight = setTimeout(() => {
      resetDailyCount();
    }, timeUntilMidnight);

    return () => {
      unsubscribeTotal();
      unsubscribeDaily();
      clearTimeout(resetAtMidnight);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "contactMessages"), {
        email,
        message,
        timestamp: new Date(),
      });

      setEmail("");
      setMessage("");

      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };
  
  return (
    <div className="">
      {/* Footer */}
      <footer className="bg-[#171717] text-center text-white lg:text-left m-auto">
        {/* DHE's logos */}
        <div className="bg-[#2a2a2a] flex flex-wrap justify-between items-center text-center border-b-2 border-gray-700 p-2 lg:justify-between">
          <hr />
          <div className=" text-lg items-start mr-auto ml-2 lg:block text-white font-bold justify-center">
            <span className="text-white"></span>
          </div>
          {/* Logos */}
          <div className="flex justify-center flex-wrap">
            <a
              href="https://www.dhe.org.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="logo.png" alt="dhe" className="h-10 w-10 mr-4" />
            </a>
            {/* RASE */}
            <a
              href="https://www.rase.co.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/shiksha.png"
                alt="rase"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* VIDHYA BHARTI */}
            <a
              href="https://vidyabharti.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/vidyabharti.png"
                alt="vidya"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* SARVATR */}
            <a
              href="https://www.sarvatr.co.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/sarvatra.png"
                alt="sarvatr"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* Temple */}
            <a
              href="https://www.alltemples.org.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/holistic.jpeg"
                alt="temple"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* Job360 */}
            <a
              href="https://jobs360degree.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/job360.png"
                alt="job"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* Poojawala */}
            <a
              href="https://poojawala.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/pooja.png"
                alt="pooja"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* Swadeshi Bazar */}
            <a href="https://www.swadeshibazaar.co.in/" target="_blank" rel="noopener noreferrer">
              <img
                src="/sb.png"
                alt="Logo Alt Text"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* Tredul */}
            <a
              href="https://tredul.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/tre-dul.png"
                alt="tredul"
                className="h-10 w-10 mr-4"
              />
            </a>
            {/* ITR */}
            <a
              href="https://www.itrchandigarh.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/logo 2.png" alt="itr" className="h-10 w-10 mr-4" />
            </a>
            {/* Vikas India */}
            <a
              href="https://vi.rase.co.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/vi.png"
                alt="vikas"
                className="h-10 w-10 mr-4"
              />
            </a>
            <a
              href="https://tudu.co.in//"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/tudu.png"
                alt="Tudu"
                className="h-10 w-10 mr-4"
              />
            </a>
            <a
              href="https://punjabsuper100.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/pb100.png"
                alt="Punjab Super 100"
                className="h-10 w-auto mr-4"
              />
            </a>
          </div>
        </div>

        {/* Help, Useful Links, Contact, Follow Us */}
        <div className=" p-3 m-6 text-center md:text-left">
          <div className="flex flex-row flex-wrap justify-between">
            {/* Help section */}
            <div className="flex flex-col text-center mb-4">
              <h6 className="mb-4 text-center justify-center font-bold uppercase md:justify-center text-white ">
                Quick Links
              </h6>
              <div className="flex flex-row">
                <div className="text-left lg:block mr-4">
                  <p className="text-white mb-3 ">
                    <Link href="/" className="hover:text-white">
                      Home
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link href="/journals" className="hover:text-white">
                      Journals
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link href="/proceedings" className="hover:text-white">
                      Proceedings
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link
                      href="/upcomingevent"
                      className="hover:text-white"
                    >
                      Upcoming Events
                    </Link>
                  </p>
                </div>

                <div className="text-left lg:block">
                  <p className="text-white mb-3">
                    <Link href="/pastevent" className="hover:text-white">
                      Past Events
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link href="/media" className="hover:text-white">
                      Media
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link href="/VibhagRoute/AcademicCouncil24" className="hover:text-white">
                      Academic Council
                    </Link>
                  </p>
                  <p className="text-white mb-3">
                    <Link href="/Accomodation" className="hover:text-white">
                      Accomodation
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            {/* Contact section */}
            <div>
              <div className="ml-4 p-4 bg-white rounded-lg mb-4 md:w-full flex flex-col lg:w-full lg:ml-0 pl-4 pr-4 justify-center font-semibold">
                <h5 className="mb-3 text-xl flex justify-center font-bold uppercase md:justify-start text-black">
                  Contact Us
                </h5>
                <form className="max-w-lg mx-auto mb-2" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-bold mb-1 text-black "
                      htmlFor="email"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full border border-red-950 rounded-md py-2 px-2 text-black"
                      placeholder="abc@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-bold mb-1 text-black "
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={1}
                      className="w-full text-black border border-red-950 rounded-md py-2 px-2"
                      placeholder="Your message here"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white h-auto w-auto py-2 px-2 rounded-md hover:bg-white hover:text-primary"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>

            {/* Follow Us and Map */}
            <div className="text-white">
              {/* Follow Us */}
              <h6 className="mb-3 flex justify-center font-semibold uppercase md:justify-start text-white">
                Follow Us
              </h6>
              {/* Include Map */}
              <div className="mt-6  flex items-center justify-center md:justify-start ">
                <iframe
                  className="w-42 h-30 border border-gray-400 mb-3"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.6604613704103!2d76.70609037438652!3d30.699827987224253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef39a32ed3c1%3A0x9ff15a51ad5117e9!2sDepartment%20of%20Holistic%20Education!5e0!3m2!1sen!2sin!4v1708812880069!5m2!1sen!2sin"
                ></iframe>
              </div>
              {/* Social media icons */}
              <div className="flex items-center justify-center md:justify-start">
                {/* Facebook */}
                <a
                  href="https://www.youtube.com/@ShikshaMahakumbh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faYoutube}
                    size="lg"
                    className="text-white hover:text-red-700 h-6 w-12" 
                  />
                </a>
                <a
                  href="https://www.facebook.com/shikshamahakumbh?mibextid=ZbWKwL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    size="lg"
                    className="text-white hover:text-blue-500 h-6 w-12" 
                  />
                </a>
                <a
                  href="https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    size="lg"
                    className="text-white hover:text-blue-500 h-6 w-12"
                  />
                </a>
                <a
                  href="https://www.instagram.com/shikshamahakumbh/profilecard/?igsh=NnljejByOXo4OTZr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    size="lg"
                    className="text-white hover:text-orange-500 h-6 w-12"
                  />
                </a>
                <a
                  href="https://x.com/shikshamahakumb?t=9ZRwSFPF-PWT8m641Aoqfg&s=08"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    size="lg"
                    className="text-white hover:text-blue-500 h-6 w-12"
                  />
                </a>
              </div>
               {/* <VisitorCounts/> */}
               <div className="flex flex-row p-2 rounded-lg space-x-4 text-red-500 font-bold">
                <div className="">
                  <p>
                    <span className="text-lg font-semibold text-white">
                      Daily Visitors:
                    </span>
                    {loading ? <Spin className="ml-2" /> : ` ${dailyVisitors}`}
                  </p>
                  <p>
                    <span className="text-lg font-semibold text-white">
                      Total Visitors:
                    </span>
                    {loading ? <Spin className="ml-2" /> : ` ${Number(totalVisitors)+94567 }`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}       
        <div className="bg-[#2a2a2a] border-t-2 border-gray-700 p-4 text-center font-bold ">
          <span className="text-white">
            ©
            <a
              href="https://www.dhe.org.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              
              2024 All rights reserved.
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
