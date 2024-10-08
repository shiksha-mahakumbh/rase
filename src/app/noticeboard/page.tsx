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
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";

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
    const latestSeven = sortedEvents.slice(0, 5);

    // Select all other events as past notices
    const olderEvents = sortedEvents.slice(5);

    // Set the state
    setCurrentNotices(latestSeven);
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
        <div className="max-h-screen overflow-y-auto">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : currentNotices.length === 0 ? (
        <Typography.Text>No current notices available.</Typography.Text>
      ) : (
        <div className="max-h-screen overflow-y-auto">
          <List
            dataSource={currentNotices}
            renderItem={(event) => (
              <List.Item className="border-b-2 border-gray-500 py-4 flex items-start">
                <div className="flex-grow flex flex-col justify-center w-2/3 pr-4">
                  <Typography.Title level={4} style={{ fontSize: "0.88rem" }}>
                    {event.title}
                  </Typography.Title>
                  {/* <Typography.Text
                    style={{ fontSize: '0.875rem' }} // Adjust the size as needed
                    className="text-gray-600"
                  >
                    {event.date}
                  </Typography.Text> */}
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
                    className="md:h-80 w-full object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(event.imageUrl)}
                    onLoad={() => handleImageLoadEnd(event.id)}
                    onError={() => handleImageLoadEnd(event.id)}
                    onLoadStart={() => handleImageLoadStart(event.id)}
                  />
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Past Notices",
      children: loading ? (
        <div className="max-h-screen overflow-y-auto">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : pastNotices.length === 0 ? (
        <Typography.Text>No past notices available.</Typography.Text>
      ) : (
        <div className="max-h-screen overflow-y-auto">
          <List
            dataSource={pastNotices}
            renderItem={(event) => (
              <List.Item className="border-b-2 border-gray-500 py-4 flex items-start">
                <div className="flex-grow flex flex-col justify-center w-2/3 pr-4">
                  <Typography.Title level={4} style={{ fontSize: "0.88rem" }}>
                    {event.title}
                  </Typography.Title>
                  {/* <Typography.Text
                    style={{ fontSize: '0.875rem' }} // Adjust the size as needed
                    className="text-gray-600"
                  >
                    {event.date}
                  </Typography.Text> */}
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
                    className="md:h-80 w-full object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageClick(event.imageUrl)}
                    onLoad={() => handleImageLoadEnd(event.id)}
                    onError={() => handleImageLoadEnd(event.id)}
                    onLoadStart={() => handleImageLoadStart(event.id)}
                  />
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <>
    <CompanyInfo />
    <NavBar />
    <div className="p-6 text-primary">
      <div className="bg-white shadow-lg rounded-lg  mx-auto">
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
        <div className="border-t border-gray-200 mt-4" />
        {/* Single HR line after all content */}
        <Modal
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          className="modal-image"
        >
          <img src={modalImage} alt="Larger view" className="w-full h-auto" />
        </Modal>
        <div className="text-center p-3">
          <span className="text-xs text-red-600">
            Note: Click on an image for a larger view
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventsComponent;
