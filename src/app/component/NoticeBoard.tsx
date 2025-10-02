"use client";

import React, { useState, useEffect } from "react";
import { Tabs, Alert, Button, Spin } from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

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

  const tabItems = [
    {
      key: "1",
      label: "Current Notices",
      children: loading ? (
        <div className="flex justify-center py-6">
          <Spin size="large" />
        </div>
      ) : currentNotices.length === 0 ? (
        <div className="text-center py-6 text-gray-500 font-semibold">
          No current notices available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {currentNotices.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
              onClick={() => handleImageClick(event.imageUrl)}
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#502a2a] font-semibold text-lg">
                    {event.title}
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center">
                    <CalendarOutlined className="mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "Past Notices",
      children: loading ? (
        <div className="flex justify-center py-6">
          <Spin size="large" />
        </div>
      ) : pastNotices.length === 0 ? (
        <div className="text-center py-6 text-gray-500 font-semibold">
          No past notices available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pastNotices.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
              onClick={() => handleImageClick(event.imageUrl)}
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover transform hover:scale-105 transition duration-300"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#502a2a] font-semibold text-lg">
                    {event.title}
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center">
                    <CalendarOutlined className="mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#fef3f3] to-[#fff7f7] rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-[#502a2a] flex items-center">
              <CalendarOutlined className="mr-2" />
              Notice Board
            </h2>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchEvents}
              type="primary"
              size="small"
              className="bg-[#502a2a] hover:bg-[#7a4343] border-none"
            >
              Refresh
            </Button>
          </div>

          <div className="p-4 text-center bg-[#fde8e8] border-b border-gray-200 flex items-center justify-center space-x-3">
            <img src="/new.gif" alt="New" className="h-6 w-6" />
            <a
              href="/donation"
              className="text-[#502a2a] font-semibold hover:text-[#7a4343] text-lg transition"
            >
              Click Here to Sponsor
            </a>
            <img src="/new.gif" alt="New" className="h-6 w-6" />
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="m-4"
            />
          )}

          <Tabs
            defaultActiveKey="1"
            className="p-4"
            tabBarGutter={50}
            items={tabItems.map((item) => ({
              key: item.key,
              label: item.label,
              children: item.children,
            }))}
          />
        </div>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width="80%"
      >
        <img src={modalImage} alt="Modal" className="w-full h-auto object-contain" />
      </Modal>
    </div>
  );
};

export default EventsComponent;
