import React from "react";
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "tailwindcss/tailwind.css";

interface ContactInfo {
  name: string;
  title: string;
  organization: string;
  address: string;
  email: string[];
  phones: string[];
  website: string[];
}

const contactData: ContactInfo = {
  name: "Shiksha Mahakumbh Abhiyan Administrative Office",
  title: "Event Management Cell",
  organization: "Department of Holistic Education",
  address: "Plot No. 1, Sector 71, SAS Nagar (Mohali) – 160071",
  email: ["info@shikshamahakumbh.com", "shikshamahakumbh23@gmail.com"],
  phones: ["+91 79034 31900", "+91 94632 31250"],
  website: ["https://shikshamahakumbh.com"],
};

const ContactUs: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#fdfaf6] via-[#fff] to-[#fdfaf6] p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto text-center border border-gray-200 hover:shadow-3xl transition-all duration-300">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-[#4d1414] tracking-wide mb-6">
        📞 Contact Us
      </h2>

      {/* Image */}
      <div className="flex justify-center mb-6">
        <a href="tel:+917903431900">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3059/3059502.png"
            alt="Contact Icon"
            className="w-28 h-28 md:w-32 md:h-32 object-contain rounded-full bg-white p-4 shadow-lg transform hover:scale-110 hover:rotate-3 transition-transform duration-300"
          />
        </a>
      </div>

      {/* Info */}
      <div className="text-lg text-gray-800 leading-relaxed space-y-4">
        <p className="font-semibold text-xl">{contactData.name}</p>
        <p>
          {contactData.title}, {contactData.organization}
        </p>
        <p className="flex justify-center items-center text-gray-700">
          <EnvironmentOutlined className="mr-2 text-primary text-xl" />
          {contactData.address}
        </p>

        {/* Emails */}
        <div className="mt-4">
          <MailOutlined className="text-primary text-xl mr-2" />
          <span className="font-semibold">Email</span>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {contactData.emails.map((email, index) => (
              <a
                key={index}
                href={`mailto:${email}`}
                className="text-blue-600 font-medium hover:text-red-600 underline transition-colors"
              >
                {email}
              </a>
            ))}
          </div>
        </div>

        {/* Phones */}
        <div className="mt-4">
          <PhoneOutlined className="text-primary text-xl mr-2" />
          <span className="font-semibold">Mobile/WhatsApp</span>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {contactData.phones.map((phone, index) => (
              <a
                key={index}
                href={`tel:${phone}`}
                className="text-blue-600 font-medium hover:text-red-600 underline transition-colors"
              >
                {phone}
              </a>
            ))}
          </div>
        </div>

        {/* Websites */}
        <div className="mt-4">
          <GlobalOutlined className="text-primary text-xl mr-2" />
          <span className="font-semibold">Website</span>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {contactData.websites.map((website, index) => (
              <a
                key={index}
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:text-red-600 underline transition-colors"
              >
                {website}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
