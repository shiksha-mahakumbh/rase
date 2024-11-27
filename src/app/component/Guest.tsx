import React from "react";
import Image from "next/image"; // Next.js Image for better handling
import { Card, CardHeader, CardBody } from "@nextui-org/react";

interface GuestProps {
  name: string;
  place: string;
  designation: string;
  imageSrc: string;
  href?: string; // Optional href property
}

const Guest: React.FC<GuestProps> = ({ name, place, designation, imageSrc, href }) => (
  <Card className="py-4 border border-primary rounded-xl max-w-sm mx-auto">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      {href ? (
        <a
          href={href}
          className="text-tiny hover:text-red-800 hover:bg-gray-100 uppercase font-bold text-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
      ) : (
        <p className="text-tiny uppercase font-bold text-black">{name}</p>
      )}
    </CardHeader>
    <CardBody className="flex flex-col py-2 items-center">
      <Image
        alt={`Image of ${name}`}
        src={imageSrc}
        width={260}
        height={290}
        className="object-cover rounded-xl mb-2"
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="w-full px-4">
        <small className="text-black">{designation}</small>
        <h4 className="font-bold text-large text-black">{place}</h4>
      </div>
    </CardBody>
  </Card>
);

export default Guest;
