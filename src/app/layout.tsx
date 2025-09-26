"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast"; 
import { useState, useEffect } from "react";
import Modal from "./component/Modal"; 

const inter = Inter({ subsets: ["latin"] });

interface CustomWindow extends Window {
  localStream?: MediaStream;
  localAudio?: HTMLAudioElement;
}

declare var window: CustomWindow;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const openModal = () => setIsModalOpen(true);
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

      window.localAudio.srcObject = stream;
      window.localAudio.autoplay = true;
    } catch (err) {
      console.error(`You got an error: ${err}`);
    }
  };

  useEffect(() => {
    // handlePermission(); // Uncomment if auto mic permission needed
  }, []);

  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense */}
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4330032354977759"
            crossOrigin="anonymous"
          ></script>
        )}

        {/* ✅ Botpress Chatbot */}
        <script async src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
        <script
          async
          src="https://mediafiles.botpress.cloud/e2ba40e6-3b23-4f8d-a2f7-e2fbd8700925/webchat/config.js"
          defer
        ></script>

        {/* ✅ SEO Optimized Metadata */}
        <title>
          शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan – Annual International
          Educational Conference
        </title>
        <meta
          name="description"
          content="Welcome to शिक्षा महाकुंभ अभियान – An initiative of Department of Holistic Education (DHE) in collaboration with INIs. Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems, aligned with NEP 2020 and Bharat@2047 vision."
        />
        <meta
          name="keywords"
          content="शिक्षा महाकुंभ 2025, Shiksha Mahakumbh, Education Conference India, International Education Conclave Bharat, Vidya Bharti, Department of Holistic Education, NEP 2020, Indian Knowledge Systems, NIPER Mohali Events, Bharat@2047, Global Education Conference, Innovation in Education, Indian Education System, Holistic Learning"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        {/* ✅ Favicon & Logo */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta property="og:image" content="https://www.rase.co.in/logo.png" />
        <meta name="twitter:image" content="https://www.rase.co.in/logo.png" />

        {/* ✅ Social Media Preview (Open Graph) */}
        <meta property="og:title" content="शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan" />
        <meta
          property="og:description"
          content="Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems, fostering Bharat@2047 vision."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rase.co.in/" />

        {/* ✅ Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="शिक्षा महाकुंभ अभियान | Shiksha Mahakumbh Abhiyan"
        />
        <meta
          name="twitter:description"
          content="Annual International Conference on Education, Research, Innovation & Indian Knowledge Systems, fostering Bharat@2047 vision."
        />

        {/* ✅ Caching Control */}
        <meta httpEquiv="cache-control" content="no-cache" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="expires" content="-1" />

        {/* ✅ Google AdSense Verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-4330032354977759"
        />
      </head>
      <body className={inter.className}>
        {/* Main Content */}
        {children}

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-white p-4 rounded-lg flex flex-col items-center justify-center text-center text-base md:text-xl font-semibold bg-primary">
            <p>
              <strong>शिक्षा महाकुंभ अभियान</strong> – 5th Edition is going to be
              held at <strong>NIPER Mohali</strong> from{" "}
              <strong>31st October to 2nd November 2025</strong>.
            </p>
          </div>
        </Modal>

        {/* Notifications */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
