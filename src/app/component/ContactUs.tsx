import React from "react";
import { MailOutlined, PhoneOutlined, GlobalOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";

interface ContactInfo {
  name: string;
  title: string;
  organization: string;
  address: string;
  emails: string[];
  phones: string[];
  websites: string[];
}

const contactData: ContactInfo = {
  name: "Shiksha Mahakumbh Abhiyan Administrative Office",
  title: "Event Management Cell,",
  organization: "Department of Holistic Education",
  address: "\nPlot No. 1, Sector 71, SAS Nagar (Mohali) – 160071",
  emails: ["info@shikshamahakumbh.com", "shikshamahakumbh23@gmail.com"],
  phones: ["7903431900", "9463231250","172 408 7787"],
  websites: [
    "https://shikshamahakumbh.com",
    "https://rase.co.in",
    
  ],
};

const ContactUs: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
      <h2 className="text-2xl font-semibold pb-4 text-primary text-center animate-fadeIn">
        Contact Us
      </h2>
      <div className="flex justify-center mt-4">
        <a href="tel:+917903431900"><img
          src="https://www.shutterstock.com/image-vector/phone-handset-speech-bubble-3d-600nw-2101642696.jpg"
          alt="3D Image"
          className="w-32 h-32 object-cover rounded-full shadow-lg transform hover:rotate-6 transition-transform duration-300"
        /></a>
      </div>
      <p className="text-primary text-xl mt-4">
        <strong>{contactData.name}</strong>
        <br />
        {contactData.title}
        <br />
        {contactData.organization}
        <br />
        {contactData.address}
        <br />
        <div className="mt-4">
          <MailOutlined className="text-2xl mr-2" />
          Email&#58;
          {contactData.emails.map((email, index) => (
            <span key={index}>
              <a
                href={`mailto:${email}`}
                className="text-primary font-semibold transition-colors duration-300 hover:text-blue-500 ml-2"
              >
                {email}
              </a>
              {index < contactData.emails.length - 1 && " | "}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <PhoneOutlined className="text-2xl mr-2" />
          Mobile/WhatsApp&#58;
          {contactData.phones.map((phone, index) => (
            <span key={index}>
              <a
                href={`tel:${phone}`}
                className="text-primary font-semibold transition-colors duration-300 hover:text-blue-500 ml-2"
              >
                {phone}
              </a>
              {index < contactData.phones.length - 1 && " | "}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <GlobalOutlined className="text-2xl mr-2" />
          Website&#58;
          {contactData.websites.map((website, index) => (
            <span key={index}>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold transition-colors duration-300 hover:text-blue-500 ml-2"
              >
                {website}
              </a>
              {index < contactData.websites.length - 1 && " | "}
            </span>
          ))}
        </div>
      </p>
    </div>
  );
};

export default ContactUs;
