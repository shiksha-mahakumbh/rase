"use client";

import React, { useMemo, useState } from "react";
import Guest from "../component/Guest";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";

const speakers = [
  {
    id: 1,
    name: "Prof. Abhay Kumar Singh",
    designation: "Vice Chancellor, Nalanda University",
    place: "The Hon'ble sir congratulates and wishes best for the event ",
    imageSrc: "/2024M/cheifguests/nalanda.jpg",
  },
  {
    id: 1,
    name: "Admiral D. K. Joshi, PVSM, AVSM, YSM, NM, VSM (Retd.)",
    designation: "Hon'ble Governor of Andaman & Nicobar Islands",
    place: "The Hon'ble Lt. Governor conveyed his Best wishes for success of the event",
    imageSrc: "/2024M/cheifguests/andaman.jpg",
  },
  {
    id: 1,
    name: " Lt. Gen. Kaiwalya Trivikram Parnaik, PVSM, UYSM, YSM (RETD.)",
    designation: "Hon'ble Governor of Arunachal Pradesh",
    place: "The Hon'ble Governor extends his Best wishes for success of the event",
    imageSrc: "/2024M/cheifguests/governer.jpg",
  },
  {
    id: 1,
    name: "Shri Rajendra Arlekar",
    designation: "Hon'ble Governor of Bihar",
    place: "माननीय राज्यपाल, बिहार के द्वारा शिक्षा महाकुंभ के द्वितीय संस्करण की कामयाबी के लिए शुभकामनाएँ व्यक्त की है",
    imageSrc: "/2024M/cheifguests/bihargovernor.png",
  },
  {
    id: 2,
    name: "Shri L. A. Ganesan",
    designation: "Hon'ble Governor of Nagaland",
    place: "Hon'ble Governor sends his best wishes for the success of the programme",
    imageSrc: "/2024M/cheifguests/nagalandgovernor.png",
  },
  {
    id: 3,
    name: "Dr. Brajesh Singh",
    designation: "Hon'ble Director, ICAR-CPRI",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/brajesh.png",
  },
  {
    id: 4,
    name: "Shri Giriraj Singh",
    designation: "Hon'ble Minister for Textiles",
    place: "Hon'ble Minister sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/girirajsingh.png",
  },
  {
    id: 5,
    name: "Dr. Anup Das",
    designation: "Hon'ble Director, ICAR Research Complex for Eastern Region",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/anupdas.png",
  },
  {
    id: 6,
    name: "Shri Vivek Bhasin",
    designation: "Hon'ble Director, BARC",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/barcdirector.png",
  },
  {
    id: 7,
    name: "Dr. (Mrs.) N. Kalaiselvi",
    designation: "Hon'ble Director General, CSIR & Secretary DSIR",
    place: "Hon'ble Director General sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgcsir.png",
  },
  {
    id: 8,
    name: "Dr. Gilliam",
    designation: "Hon'ble President, Boston University",
    place: "Hon'ble President sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/boston.png",
  },
  {
    id: 9,
    name: "Major General BK Sharma, AVSM, SM** (RETD.)",
    designation: "Hon'ble Director General, USI",
    place: "Hon'ble Director General sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgusi.png",
  },
  {
    id: 10,
    name: "Dr. S. Periyasamy",
    designation: "Hon'ble Director, CSTRI",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/cstridirector.png",
  },
];

const WishesReceived: React.FC = () => {
  const [query, setQuery] = useState("");

  const allGuests = useMemo(() => speakers, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allGuests;
    return allGuests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.designation.toLowerCase().includes(q) ||
        g.place.toLowerCase().includes(q)
    );
  }, [allGuests, query]);

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Best Wishes", href: "/best-wishes" },
            { label: "Wishes Received" },
          ]}
          className="mb-8"
        />

        <label htmlFor="wishes-search" className="sr-only">
          Search dignitaries
        </label>
        <input
          id="wishes-search"
          type="search"
          placeholder="Search by name, designation, or message…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-8 w-full max-w-md min-h-[44px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
        />

        {featured.length > 0 && (
          <section className="mb-10" aria-labelledby="featured-dignitaries">
            <h2 id="featured-dignitaries" className="mb-6 text-xl font-bold text-brand-navy">
              Featured Dignitaries
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((guest, i) => (
                <div key={`featured-${guest.name}-${i}`} className="md:scale-[1.02]">
                  <Guest {...guest} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="all-wishes">
          <h2 id="all-wishes" className="mb-6 text-xl font-bold text-brand-navy">
            All Messages ({filtered.length})
          </h2>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {rest.map((guest, index) => (
              <div key={`${guest.name}-${index}`} className="mb-4 break-inside-avoid">
                <Guest {...guest} />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-gray-500">No messages match your search.</p>
          )}
        </section>
    </div>
  );
};

export default WishesReceived;
