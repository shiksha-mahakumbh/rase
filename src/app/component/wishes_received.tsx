"use client";
import React from "react";

const speakers = [
  {
    id: 1,
    name: "Shri Rajendra Arlekar",
    designation: "Hon'ble Governor of Bihar",
    place: "माननीय राज्यपाल, बिहार के द्वारा शिक्षा महाकुंभ के द्वितीय संस्करण की कामयाबी के लिए शुभकामनाएँ व्यक्त की है",
    imageSrc: "/2024M/cheifguests/bihargovernor.png",
  },
  {
    id: 2,
    name: "Shri La Ganesan",
    designation: "Hon'ble Governor of Nagaland",
    place: "Hon'ble Governor sends his best wishes for the success of the programme",
    imageSrc: "/2024M/cheifguests/nagalandgovernor.png",
  },
  {
    id: 3,
    name: "Dr. Brajesh Singh",
    designation: "Director, ICAR-CPRI",
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
    designation: "Director, ICAR Research Complex for Eastern Region",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/anupdas.png",
  },
  {
    id: 6,
    name: "Shri Vivek Bhasin",
    designation: "Director, BARC",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/barcdirector.png",
  },
  {
    id: 7,
    name: "Dr. (Mrs.) N. Kalaiselvi",
    designation: "Director General, CSIR & Secretary DSIR",
    place: "Hon'ble Director General sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgcsir.png",
  },
  {
    id: 8,
    name: "Dr. Gilliam",
    designation: "President, Boston University",
    place: "Hon'ble President sends her best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/boston.png",
  },
  {
    id: 9,
    name: "Major General BK Sharma, AVSM, SM** (Retd)",
    designation: "Director General, USI",
    place: "Hon'ble Director General sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/dgusi.png",
  },
  {
    id: 10,
    name: "Dr. S. Periyasamy",
    designation: "Director, CSTRI",
    place: "Hon'ble Director sends his best wishes for the success of the programme",
    imageSrc: "/2024M/wishes/cstridirector.png",
  },
];

const Guest: React.FC<{
  name: string;
  designation: string;
  place: string;
  imageSrc: string;
}> = ({ name, designation, place, imageSrc }) => (
  <div className="border rounded-lg p-4 shadow-md flex flex-col items-center">
    <div className="w-full h-60 overflow-hidden rounded-lg">
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
    <h3 className="text-lg font-bold mt-4 text-center">{name}</h3>
    <p className="text-sm text-gray-600 text-center">{designation}</p>
    <p className="mt-2 text-gray-800 text-center">{place}</p>
  </div>
);

const WishesReceived: React.FC = () => {
  return (
    <div className="p-4">
      <p className="text-xl md:text-2xl text-primary text-center uppercase font-bold mb-8">
        Wishes Received for the success of Shiksha Mahakumbh 2024
      </p>
      <div className="flex flex-wrap justify-center">
        {speakers.map((guest) => (
          <div key={guest.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
            <Guest {...guest} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishesReceived;