"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast'; // Toaster for notifications
import { useState, useEffect } from "react";
import Modal from './component/Modal'; // Import the modal component

const inter = Inter({ subsets: ['latin'] });

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
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state

  // Open and close handlers for modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle microphone permissions
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
    // You can uncomment this to request permissions automatically
    // handlePermission();
  }, []);

  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4330032354977759"
            crossOrigin="anonymous"
          ></script>
        )}
        <script async src="https://cdn.botpress.cloud/webchat/v1/inject.js"></script>
        <script
          async
          src="https://mediafiles.botpress.cloud/e2ba40e6-3b23-4f8d-a2f7-e2fbd8700925/webchat/config.js"
          defer
        ></script>
      </head>
      <meta httpEquiv="refresh" content="1000" />
      <meta charSet="utf-8" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Welcome to शिक्षा महाकुंभ and शिक्षा कुंभ। An initiative of DHE in collaboration with INIs to hold शिक्षा महाकुंभ annually and शिक्षा कुंभ half yearly.</title>
      <meta name="keywords" content="RASE2023, RASE 2023, National Conference on Recent Advances in School Education, rase 2023, r a s e, mahakumbh 2024, mahakumbh 2023, महाकुंभ 2023, महाकुंभ 2024" />
      <meta name="description" content="Joint Conference" />
      <meta httpEquiv="cache-control" content="no-cache" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="-1" />
      <meta name="google-adsense-account" content="ca-pub-4330032354977759" />
      <body className={inter.className}>
        {/* Main Content */}
        {children}

        {/* Modal Component */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="text-white p-2 rounded-lg flex justify-center text-center text-base md:text-xl font-semibold bg-primary">
            2nd Edition of Shiksha Mahakumbh is postponed due to unavoidable circumstances. All registrations and papers submitted will be valid in the rescheduled programme. Further the process of registrations and invitations will continue as earlier. Inconvenience caused due to postponement of the programme is deeply regretted. Stay tuned with us at our website and social media handles for more updates.
          </div>
        </Modal>

        {/* Toaster for notifications */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
