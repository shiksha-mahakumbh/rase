"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import Modal from "./component/Modal";

const inter = Inter({ subsets: ["latin"] });

declare global {
  interface Window {
    localStream?: MediaStream;
    localAudio?: HTMLAudioElement;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => setIsModalOpen(false);

  const handlePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      window.localStream = stream;

      if (!window.localAudio) {
        window.localAudio = new Audio();
        document.body.appendChild(window.localAudio);
      }

      // @ts-ignore
      window.localAudio.srcObject = stream;

      window.localAudio.autoplay = true;
    } catch (err) {
      console.error("Microphone permission error:", err);
    }
  };

  useEffect(() => {
    // Uncomment if auto mic permission is needed
    // handlePermission();
  }, []);

  return (
    <html lang="en">
      <head>
        {/* ✅ Charset */}
        <meta charSet="utf-8" />
        <meta
          httpEquiv="Content-Type"
          content="text/html; charset=utf-8"
        />

        {/* ✅ Responsive */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* ✅ Title */}
        <title>
          शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan
        </title>

        {/* ✅ SEO Meta */}
        <meta
          name="description"
          content="Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems aligned with NEP 2020 and Bharat@2047 vision."
        />

        <meta
          name="keywords"
          content="Shiksha Mahakumbh, शिक्षा महाकुंभ, Education Conference India, Vidya Bharti, DHE, Olympiad, Research, Talent Conclave"
        />

        {/* ✅ Favicon */}
        <link rel="icon" href="/sLogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/sLogo.png" />

        {/* ✅ Open Graph */}
        <meta
          property="og:title"
          content="शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan"
        />

        <meta
          property="og:description"
          content="Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rase.co.in/" />

        <meta
          property="og:image"
          content="https://www.rase.co.in/sLogo.png"
        />

        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan"
        />

        <meta
          name="twitter:description"
          content="Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems."
        />

        <meta
          name="twitter:image"
          content="https://www.rase.co.in/sLogo.png"
        />

        {/* ✅ Cache */}
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="expires" content="-1" />

        {/* ✅ Google Adsense */}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4330032354977759"
            crossOrigin="anonymous"
          />
        )}

        <meta
          name="google-adsense-account"
          content="ca-pub-4330032354977759"
        />

        {/* ✅ Botpress */}
        <script
          async
          src="https://cdn.botpress.cloud/webchat/v1/inject.js"
        ></script>

        <script
          async
          src="https://mediafiles.botpress.cloud/e2ba40e6-3b23-4f8d-a2f7-e2fbd8700925/webchat/config.js"
          defer
        ></script>
      </head>

      <body
        className={`${inter.className} overflow-x-hidden bg-black`}
      >
        {/* ✅ Main Content */}
        <main className="w-full overflow-x-hidden">
          {children}
        </main>

        {/* ✅ Announcement Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl mx-auto text-white px-4 py-5 sm:p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center text-center bg-primary overflow-hidden">
            
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight break-words">
              शिक्षा महाकुंभ अभियान
            </h1>

            {/* Edition */}
            <h2 className="text-lg sm:text-2xl md:text-4xl font-bold mt-2 text-yellow-300">
              6th Edition
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base md:text-xl font-medium leading-relaxed max-w-3xl px-1">
              Join the national educational movement at{" "}
              <span className="font-bold text-yellow-200">
                NIT Hamirpur
              </span>{" "}
              from{" "}
              <span className="font-bold">
                9th October to 11th October 2026
              </span>
            </p>

            {/* Info Box */}
            <div className="mt-5 w-full text-xs sm:text-sm md:text-lg leading-relaxed bg-white/10 p-3 sm:p-4 md:p-5 rounded-xl border border-white/20">
              <span className="font-semibold text-yellow-200">
                Multi-track conferences, conclaves, olympiads,
                innovation projects, talent conclaves, exhibitions,
                workshops, and academic activities
              </span>{" "}
              —{" "}
              <a
                href="https://www.rase.co.in/VibhagRoute/AcademicCouncil24"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline hover:text-cyan-200 transition font-semibold break-words"
              >
                click here
              </a>
            </div>

            {/* Button */}
            <button
              onClick={closeModal}
              className="mt-6 px-5 py-2.5 text-sm sm:text-base md:text-lg bg-white text-black font-bold rounded-full hover:scale-105 transition-transform duration-300"
            >
              Explore Now
            </button>
          </div>
        </Modal>

        {/* ✅ Toast Notifications */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
