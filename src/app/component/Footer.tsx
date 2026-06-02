"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/app/firebase";
import { Spin } from "antd";
import { motion } from "framer-motion";
import { normalizeStaticImageSrc } from "./home/normalizeImageSrc";

interface FooterLogo {
  href: string;
  src: string;
  alt: string;
}

interface FooterLink {
  name: string;
  href: string;
}

const footerLogos: FooterLogo[] = [
  { href: "https://www.dhe.org.in/", src: "/logo.png", alt: "DHE" },
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
];

const quickLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Journals", href: "/journals" },
  { name: "Proceedings", href: "/proceedings" },
  { name: "Upcoming Events", href: "/upcomingevent" },
  { name: "Past Events", href: "/pastevent" },
  { name: "Media", href: "/media" },
  { name: "Academic Council", href: "/VibhagRoute/AcademicCouncil24" },
  { name: "Accommodation", href: "/Accomodation" },
];

const socialLinks = [
  { icon: faYoutube, href: "https://www.youtube.com/@ShikshaMahakumbh", label: "YouTube" },
  { icon: faFacebook, href: "https://www.facebook.com/shikshamahakumbh?mibextid=ZbWKwL", label: "Facebook" },
  { icon: faLinkedin, href: "https://www.linkedin.com/in/shiksha-mahakumbh-abhiyan-3a134a283", label: "LinkedIn" },
  { icon: faInstagram, href: "https://www.instagram.com/shikshamahakumbh/profilecard", label: "Instagram" },
  { icon: faXTwitter, href: "https://x.com/shikshamahakumb", label: "X (Twitter)" },
];

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
            await setDoc(yesterdayDocRef, {
              count: dailyData.count,
              date: dailyData.date,
            });
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
        if (!dailyDocSnap.exists())
          await setDoc(dailyDocRef, { count: 0, date: today });
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
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      ).getTime() - now.getTime();
    const resetAtMidnight = setTimeout(
      () => resetDailyCount(),
      timeUntilMidnight
    );

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
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#1a1210] via-[#2a1818] to-[#1f1414] px-6 py-14 text-white">
      {/* Decorative elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Logo Wall */}
        <div className="mb-12">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            Institutional Ecosystem
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {footerLogos.map((logo, i) => (
              <motion.a
                key={i}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm transition-colors hover:border-amber-400/30 hover:bg-white/10"
              >
                <Image
                  src={normalizeStaticImageSrc(logo.src)}
                  alt={logo.alt}
                  width={48}
                  height={48}
                  className="h-10 w-auto md:h-12"
                />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          {/* Quick Links */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h5 className="mb-5 text-xl font-bold text-amber-400">
              Quick Links
            </h5>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors duration-200 hover:text-yellow-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-6 text-black shadow-2xl">
            <h5 className="mb-4 text-center text-xl font-bold md:text-left">
              Contact Us
            </h5>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <textarea
                rows={2}
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-yellow-500 py-2.5 font-bold text-black transition-colors hover:bg-yellow-600"
              >
                Send Message
              </button>
            </form>

            {/* Visitor Counters */}
            <div className="mt-4 flex items-center justify-around rounded-xl bg-gray-100 p-4 text-black">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Daily Visitors
                </p>
                <p className="text-xl font-extrabold text-primary">
                  {loading ? <Spin size="small" /> : dailyVisitors}
                </p>
              </div>
              <div className="h-10 w-px bg-gray-300" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total Visitors
                </p>
                <p className="text-xl font-extrabold text-primary">
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    Number(totalVisitors) + 94567
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Socials + Map */}
          <div className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h5 className="text-xl font-bold text-amber-400">Follow Us</h5>
            <div className="flex justify-center space-x-5 text-2xl md:justify-start">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 transition-all hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-yellow-400"
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>

            {/* Map */}
            <iframe
              title="Department of Holistic Education Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.6604613704103!2d76.70609037438652!3d30.699827987224253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef39a32ed3c1%3A0x9ff15a51ad5117e9!2sDepartment%20of%20Holistic%20Education!5e0!3m2!1sen!2sin!4v1708812880069!5m2!1sen!2sin"
              className="h-48 w-full rounded-xl border border-white/20"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-gray-300">
            © 2025{" "}
            <Link
              href="https://www.dhe.org.in/"
              className="text-yellow-400 transition-colors hover:text-white"
            >
              Shiksha Mahakumbh Abhiyan
            </Link>
            . All Rights Reserved.
          </p>
          <p className="mx-auto mt-4 max-w-4xl text-sm leading-relaxed text-gray-400">
            The Microsoft CMT service was used for managing the peer-reviewing
            process for this conference. This service was provided for free by
            Microsoft, and they bore all related expenses, including costs for
            Azure cloud services as well as software development and support.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
