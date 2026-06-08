"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import type { NoticeboardEvent } from "@/lib/noticeboard/getEvents";
import ImageLightbox from "../component/ui/ImageLightbox";

type Props = {
  initialEvents: NoticeboardEvent[];
};

type TabKey = "current" | "past";

export default function NoticeboardClient({ initialEvents }: Props) {
  const [events, setEvents] = useState<NoticeboardEvent[]>(initialEvents);
  const [currentNotices, setCurrentNotices] = useState<NoticeboardEvent[]>([]);
  const [pastNotices, setPastNotices] = useState<NoticeboardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("current");
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
    <ul className="max-h-[70vh] space-y-4 overflow-y-auto" role="list">
      {items.map((event) => (
        <li
          key={event.id}
          className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-start"
        >
          <div className="min-w-0 flex-1 sm:w-2/3">
            <h3 className="text-sm font-semibold text-brand-navy md:text-base">
              {event.title}
            </h3>
          </div>
          <div className="relative w-full shrink-0 sm:w-1/3">
            {imageLoading[event.id] && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80"
                aria-hidden="true"
              >
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-navy border-t-transparent" />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleImageClick(event.imageUrl)}
              className="block w-full rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
              aria-label={`View larger image for ${event.title}`}
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={400}
                height={320}
                unoptimized
                sizes="(max-width: 768px) 100vw, 400px"
                className="h-auto w-full cursor-pointer rounded-lg object-cover md:max-h-80"
                onLoad={() => handleImageLoadEnd(event.id)}
                onError={() => handleImageLoadEnd(event.id)}
                onLoadStart={() => handleImageLoadStart(event.id)}
              />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  const activeItems = activeTab === "current" ? currentNotices : pastNotices;
  const emptyMessage =
    activeTab === "current"
      ? "No current notices available."
      : "No past notices available.";

  return (
    <div className="text-brand-navy">
      <div className="mx-auto rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="flex items-center text-lg font-semibold">
            Notice Board
            <span className="ml-2 text-brand-saffron" aria-hidden="true">
              📅
            </span>
          </h2>
          <button
            type="button"
            onClick={fetchEvents}
            disabled={loading}
            aria-label="Refresh notices"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-navy hover:bg-brand-surface-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron disabled:opacity-50"
          >
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="p-4">
          <div
            className="mb-4 flex gap-2"
            role="tablist"
            aria-label="Notice categories"
          >
            {(
              [
                { key: "current" as const, label: "Current Notices" },
                { key: "past" as const, label: "Past Notices" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`notice-panel-${tab.key}`}
                id={`notice-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                  activeTab === tab.key
                    ? "bg-brand-navy text-white"
                    : "bg-white text-brand-navy ring-1 ring-slate-200 hover:ring-brand-saffron/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id={`notice-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`notice-tab-${activeTab}`}
          >
            {loading ? (
              <div className="space-y-3" aria-busy="true" aria-label="Loading notices">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            ) : activeItems.length === 0 ? (
              <p className="text-sm text-slate-600">{emptyMessage}</p>
            ) : (
              renderNoticeList(activeItems)
            )}
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200" />
        <ImageLightbox
          isOpen={isModalVisible}
          imageSrc={modalImage}
          onClose={() => {
            setIsModalVisible(false);
            setModalImage("");
          }}
          alt="Larger view of notice"
        />
        <p className="p-3 text-center text-xs text-red-600">
          Note: Click on an image for a larger view
        </p>
      </div>
    </div>
  );
}
