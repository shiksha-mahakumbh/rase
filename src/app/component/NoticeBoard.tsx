"use client";

import React, { useState, useEffect } from "react";
import { Tabs, Alert, Button, Spin, Modal } from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import clsx from "clsx";

type Event = {
  id: string;
  title: string;
  date: string; // ISO date string
  imageUrl: string;
};

const EventsComponent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentNotices, setCurrentNotices] = useState<Event[]>([]);
  const [pastNotices, setPastNotices] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));
      setEvents(eventsData);
    } catch (error) {
      setError("Error fetching events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setCurrentNotices(sortedEvents.slice(0, 5));
    setPastNotices(sortedEvents.slice(5));
  }, [events]);

  const handleImageClick = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalImage("");
  };

  const handleImageLoadStart = (id: string) => {
    setImageLoading((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageLoadEnd = (id: string) => {
    setImageLoading((prev) => {
      const newLoading = { ...prev };
      delete newLoading[id];
      return newLoading;
    });
  };

  const renderEventCard = (event: Event) => (
    <div
      key={event.id}
      className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 mb-4 opacity-0 animate-fadeIn"
    >
      {imageLoading[event.id] && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <Spin size="large" />
        </div>
      )}
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => handleImageClick(event.imageUrl)}
        onLoad={() => handleImageLoadEnd(event.id)}
        onError={() => handleImageLoadEnd(event.id)}
        onLoadStart={() => handleImageLoadStart(event.id)}
      />
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={() => router.push("/noticeboard")}
          className="text-white bg-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          Read More
        </button>
      </div>
      <div className="p-4 bg-white">
        <h3 className="font-bold text-lg text-primary">{event.title}</h3>
        <p className="text-gray-500 text-sm">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: "Current Notices",
      children: loading ? (
        <Spin size="large" className="my-4" />
      ) : currentNotices.length === 0 ? (
        <Alert message="No current notices available." type="info" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
          {currentNotices.map(renderEventCard)}
        </div>
      ),
    },
    {
      key: "2",
      label: "Past Notices",
      children: loading ? (
        <Spin size="large" className="my-4" />
      ) : pastNotices.length === 0 ? (
        <Alert message="No past notices available." type="info" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
          {pastNotices.map(renderEventCard)}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <span className="text-xl font-bold text-primary flex items-center gap-2">
            Notice Board <CalendarOutlined />
          </span>
          <Button icon={<ReloadOutlined />} onClick={fetchEvents} type="primary">
            Refresh
          </Button>
        </div>

        <div className="text-center p-2 border-b border-gray-200 flex justify-center items-center gap-2">
          <img src="new.gif" alt="new" />
          <a
            href="/donation"
            className="text-blue-600 font-semibold hover:text-primary transition-colors duration-300"
          >
            Click Here to Sponsor
          </a>
          <img src="new.gif" alt="new" />
        </div>

        {error && (
          <Alert message="Error" description={error} type="error" className="m-4" />
        )}

        <Tabs defaultActiveKey="1" className="p-4" items={tabItems} />
      </div>

      {/* Modal for image */}
      <Modal open={isModalVisible} onCancel={handleCancel} footer={null} centered width="80%">
        <img src={modalImage} alt="Modal" className="w-full h-auto object-contain" />
      </Modal>

      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default EventsComponent;
