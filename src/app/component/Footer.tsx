"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { addDoc, collection, doc, onSnapshot, updateDoc, getDoc, increment, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/app/firebase";
import { Spin } from "antd";

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
    const today = new Date().toISOString().split("T")[0];

    const resetDailyCount = async () => {
      try {
        const dailyDocSnap = await getDoc(dailyDocRef);
        if (dailyDocSnap.exists()) {
          const dailyData = dailyDocSnap.data();
          if (dailyData.date !== today) {
            await setDoc(yesterdayDocRef, { count: dailyData.count, date: dailyData.date });
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

        if (!totalDocSnap.exists()) await setDoc(totalDocRef, { count: 0 });
        if (!dailyDocSnap.exists()) await setDoc(dailyDocRef, { count: 0, date: today });
        else if (dailyDocSnap.data().date !== today) await resetDailyCount();

        await updateDoc(totalDocRef, { count: increment(1) });
        await updateDoc(dailyDocRef, { count: increment(1) });
      } catch (error) {
        console.error("Error updating visitor counts:", error);
      }
    };

    updateVisitorCount();

    const unsubscribeTotal = onSnapshot(totalDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTotalVisitors(docSnap.data().count);
        setLoading(false);
      }
    });

    const unsubscribeDaily = onSnapshot(dailyDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setDailyVisitors(docSnap.data().count);
        setLoading(false);
      }
    });

    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime() - now.getTime();
    const resetAtMidnight = setTimeout(() => resetDailyCount(), timeUntilMidnight);

    return () => {
      unsubscribeTotal();
      unsubscribeDaily();
      clearTimeout(resetAtMidnight);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactMessages"), {
        email,
        message,
        timestamp: new Date(),
      });
      setEmail("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Try again later.");
    }
  };

  return (
    <footer className="bg-gradient-to-tr from-gray-900 to-gray-800 text-white py-12 px-6">
      {/* Top Section - Logos */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {[
          { href: "https://www.dhe.org.in/", src: "logo.png", alt: "DHE" },
          { href: "https://www.rase.co.in/", src: "/shiksha.png", alt: "RASE" },
          { href: "https://vidyabharti.net/", src: "/vidyabharti.png", alt: "Vidya Bharti" },
          { href: "https://www.sarvatr.co.in/", src: "/sarvatra.png", alt: "Sarvatr" },
          { href: "https://www.alltemples.org.in/", src: "/holistic.jpeg", alt: "Temple" },
          { href: "https://jobs360degree.com/", src: "/job360.png", alt: "Job360" },
          { href: "https://poojawala.in/", src: "/pooja.png", alt: "Pooja" },
          { href: "https://www.swadeshibazaar.co.in/", src: "/sb.png", alt: "Swadeshi Bazar" },
          { href: "https://tredul.in/", src: "/tre-dul.png", alt: "Tredul" },
          { href: "https://www.itrchandigarh.org/", src: "/logo 2.png", alt: "ITR" },
          { href: "https://vi.rase.co.in/", src: "/vi.png", alt: "Vikas India" },
          { href: "https://tudu.co.in//", src: "/tudu.png", alt: "Tudu" },
          { href: "https://punjabsuper100.com/", src: "/pb100.png", alt: "Punjab Super 100" },
        ].map((logo, i) => (
          <a key={i} href={logo.href} target="_blank" rel="noopener noreferrer">
            <img src={logo.src} alt={logo.alt} className="h-12 w-auto hover:scale-110 transition-transform duration-300" />
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Quick Links */}
        <div>
          <h5 className="font-bold text-xl mb-4">Quick Links</h5>
          <ul className="space-y-2">
            {[
              { name: "Home", href: "/" },
              { name: "Journals", href: "/journals" },
              { name: "Proceedings", href: "/proceedings" },
              { name: "Upcoming Events", href: "/upcomingevent" },
              { name: "Past Events", href: "/pastevent" },
              { name: "Media", href: "/media" },
              { name: "Academic Council", href: "/VibhagRoute/AcademicCouncil24" },
              { name: "Accommodation", href: "/Accomodation" },
            ].map((link, i) => (
              <li key={i}>
                <Link href={link.href} className="hover:text-yellow-400 transition-colors duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <h5 className="font-bold text-xl mb-4 text-center md:text-left">Contact Us</h5>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
            <textarea
              rows={2}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
            <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md hover:bg-yellow-600 transition-colors">
              Send Message
            </button>
          </form>

          {/* Visitor Counters */}
          <div className="mt-4 flex justify-around items-center bg-gray-200 text-black rounded-md p-3">
            <div>
              <p className="font-bold">Daily Visitors</p>
              <p>{loading ? <Spin /> : dailyVisitors}</p>
            </div>
            <div>
              <p className="font-bold">Total Visitors</p>
              <p>{loading ? <Spin /> : Number(totalVisitors) + 94567}</p>
            </div>
          </div>
        </div>

        {/* Socials + Map */}
        <div className="space-y-4">
          <h5 className="font-bold text-xl">Follow Us</h5>
          <div className="flex space-x-4 justify-center md:justify-start text-2xl">
            {[faYoutube, faFacebook, faLinkedin, faInstagram, faXTwitter].map((icon, i) => (
              <a
                key={i}
                href={
                  i === 0
                    ? "https://www.youtube.com/@ShikshaMahakumbh"
                    : i === 1
                    ? "https://www.facebook.com/shikshamahakumbh?mibextid=ZbWKwL"
                    : i === 2
                    ? "https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283"
                    : i === 3
                    ? "https://www.instagram.com/shikshamahakumbh/profilecard"
                    : "https://x.com/shikshamahakumb"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>

          {/* Map */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.6604613704103!2d76.70609037438652!3d30.699827987224253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef39a32ed3c1%3A0x9ff15a51ad5117e9!2sDepartment%20of%20Holistic%20Education!5e0!3m2!1sen!2sin!4v1708812880069!5m2!1sen!2sin"
            className="w-full h-48 rounded-lg border-2 border-gray-400"
          ></iframe>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center">
        <p>
          © 2025 <Link href="https://www.dhe.org.in/" className="text-yellow-400 hover:text-white">Shiksha Mahakumbh Abhiyan</Link>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
