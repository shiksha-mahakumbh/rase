"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  List,
  Typography,
  Tabs,
  Alert,
  Button,
  Skeleton,
  Spin,
} from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import type { NoticeboardEvent } from "@/lib/noticeboard/getEvents";
import ImageLightbox from "../component/ui/ImageLightbox";
import CompanyInfo from "../component/CompanyInfo";
import NavBar from "../component/NavBar";

type Props = {
  initialEvents: NoticeboardEvent[];
};

export default function NoticeboardClient({ initialEvents }: Props) {
  const [events, setEvents] = useState<NoticeboardEvent[]>(initialEvents);
  const [currentNotices, setCurrentNotices] = useState<NoticeboardEvent[]>([]);
  const [pastNotices, setPastNotices] = useState<NoticeboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData: NoticeboardEvent[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<NoticeboardEvent, "id">),
      }));
      setEvents(eventsData);
    } catch {
      setError("Error fetching events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const renderNoticeList = (items: NoticeboardEvent[]) => (
    <div className="max-h-screen overflow-y-auto">
      <List
        dataSource={items}
        renderItem={(event) => (
          <List.Item className="flex items-start border-b-2 border-gray-500 py-4">
            <div className="flex w-2/3 flex-grow flex-col justify-center pr-4">
              <Typography.Title level={4} style={{ fontSize: "0.88rem" }}>
                {event.title}
              </Typography.Title>
            </div>
            <div className="relative w-1/3">
              {imageLoading[event.id] && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white opacity-75">
                  <Spin />
                </div>
              )}
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={320}
                unoptimized
                sizes="(max-width: 768px) 33vw, 400px"
                className="w-full cursor-pointer rounded-lg object-cover md:h-80"
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
  );

  const tabItems = [
    {
      key: "1",
      label: "Current Notices",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : currentNotices.length === 0 ? (
        <Typography.Text>No current notices available.</Typography.Text>
      ) : (
        renderNoticeList(currentNotices)
      ),
    },
    {
      key: "2",
      label: "Past Notices",
      children: loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : pastNotices.length === 0 ? (
        <Typography.Text>No past notices available.</Typography.Text>
      ) : (
        renderNoticeList(pastNotices)
      ),
    },
  ];

  return (
    <>
      <CompanyInfo />
      <NavBar />
      <div className="p-6 text-primary">
        <div className="mx-auto rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <span className="flex items-center text-lg font-semibold">
              Notice Board
              <CalendarOutlined className="ml-2 text-primary" />
            </span>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchEvents}
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
          <div className="mt-4 border-t border-gray-200" />
          <ImageLightbox
            isOpen={isModalVisible}
            imageSrc={modalImage}
            onClose={handleCancel}
            alt="Larger view"
          />
          <div className="p-3 text-center">
            <span className="text-xs text-red-600">
              Note: Click on an image for a larger view
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
