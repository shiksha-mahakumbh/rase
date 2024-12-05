"use client"

import React, { useState, useEffect } from "react";
import {
  List,
  Typography,
  Tabs,
  Alert,
  Modal,
  Button,
  Skeleton,
  Spin,
} from "antd";
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

  // State to track the loading status of all images
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [allImagesLoaded, setAllImagesLoaded] = useState<boolean>(false);

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

  const handleRefresh = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Sort events by date in descending order
    const sortedEvents = [...events].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Select the latest 5 events as current notices
    const latestFive = sortedEvents.slice(0, 5);

    // Select all other events as past notices
    const olderEvents = sortedEvents.slice(5);

    // Set the state
    setCurrentNotices(latestFive);
    setPastNotices(olderEvents);
  }, [events]);

  useEffect(() => {
    // Check if all images are loaded
    if (Object.keys(imageLoading).length === 0) {
      setAllImagesLoaded(true);
    } else {
      setAllImagesLoaded(
        Object.values(imageLoading).every((loading) => !loading)
      );
    }
  }, [imageLoading]);

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

  const tabItems = [
    {
      key: "1",
      label: "Current Notices",
      children: loading ? (
        <div className="max-h-64 overflow-y-auto">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : currentNotices.length === 0 ? (
        <Typography.Text>No current notices available.</Typography.Text>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <List
            dataSource={currentNotices}
            renderItem={(event) => (
              <List.Item className="border-b-2 border-gray-500 py-4 flex items-start">
                <div className="flex-grow flex flex-col justify-center w-2/3 pr-4">
                  <Typography.Title level={4} style={{ fontSize: "0.88rem" }}>
                    {event.title} 
                  </Typography.Title>
                </div>
                <div className="relative w-1/3">
                  {imageLoading[event.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10">
                      <Spin />
                    </div>
                  )}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-auto w-full object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(event.imageUrl)}
                    onLoad={() => handleImageLoadEnd(event.id)}
                    onError={() => handleImageLoadEnd(event.id)}
                    onLoadStart={() => handleImageLoadStart(event.id)}
                  />
                </div>
              </List.Item>
            )}
          />
          {currentNotices.length > 0 && (
            <div className="text-center mt-4">
              <Button type="link" onClick={() => router.push('/noticeboard')}>
                Read More
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Past Notices",
      children: loading ? (
        <div className="max-h-64 overflow-y-auto">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : pastNotices.length === 0 ? (
        <Typography.Text>No past notices available.</Typography.Text>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <List
            dataSource={pastNotices.slice(0, 5)} // Show only the first 5 notices
            renderItem={(event) => (
              <List.Item className="border-b-2 border-gray-500 py-4 flex items-start">
                <div className="flex-grow flex flex-col justify-center w-2/3 pr-4">
                  <Typography.Title level={4} style={{ fontSize: "0.88rem" }}>
                    {event.title}
                  </Typography.Title>
                </div>
                <div className="relative w-1/3">
                  {imageLoading[event.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white opacity-75 z-10">
                      <Spin />
                    </div>
                  )}
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-auto w-full object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(event.imageUrl)}
                    onLoad={() => handleImageLoadEnd(event.id)}
                    onError={() => handleImageLoadEnd(event.id)}
                    onLoadStart={() => handleImageLoadStart(event.id)}
                  />
                </div>
              </List.Item>
            )}
          />
          {pastNotices.length > 5 && (
            <div className="text-center mt-4">
              <Button type="link" onClick={() => router.push('/noticeboard')}>
                Read More
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 text-primary">
      <div className="bg-white shadow-lg rounded-lg max-w-lg mx-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="text-lg font-semibold flex items-center">
            Notice Board
            <CalendarOutlined className="ml-2 text-primary" />
          </span>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className="ml-2"
            size="small"
            type="text"
          />
        </div>
        <span className="text-lg p-2 flex text-center font-semibold justify-center border-b border-gray-300 items-center">
          <img src="new.gif" alt="" />&nbsp;
          <a
            href="/donation"
            className="text-base text-blue-600 hover:text-primary"
          >
            Click Here to Sponsor
          </a>
          &nbsp;<img src="new.gif" alt="" />
        </span>
        {/* <span className="text-lg p-2 flex text-center font-semibold justify-center border-b border-gray-300 items-center">
          <img src="new.gif" alt="" />&nbsp;
          <a
            href="/tentative_schdule.xlsx"
            className="text-base text-blue-600 hover:text-primary"
          >

            Tentative Schedule शिक्षा महाकुंभ - 2024
          </a> 
          &nbsp;<img src="new.gif" alt="" />
        </span> */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="m-4"
          />
        )}
        <Tabs defaultActiveKey="1" className="p-4">
          {tabItems.map((item) => (
            <Tabs.TabPane tab={item.label} key={item.key}>
              {item.children}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width="80%"
      >
        <img
          src={modalImage}
          alt="Modal"
          className="w-full h-auto object-contain"
        />
      </Modal>
    </div>
  );
};

export default EventsComponent;
