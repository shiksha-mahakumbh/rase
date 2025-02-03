import React from 'react';
import Image from 'next/image';

// Define a type for the account details
type AccountDetails = {
    accountName: string;
    accountNumber: string;
    bank: string;
    branch: string;
    ifscCode: string;
    upiId: string;
};

// Define a type for sponsorship links
type SponsorshipLinks = {
    link1: string;
    link1Text: string;
    link2: string;
    link2Text: string;
};

const Donate: React.FC = () => {
    // Function to render each section with its custom account details, image, and sponsorship links
    const renderSection = (
        heading: string,
        accountDetails: AccountDetails,
        imageSrc: string,
        sponsorshipLinks: SponsorshipLinks
    ) => (
        <div className="flex flex-col items-center justify-center px-4 lg:px-8 py-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6 text-center">
                {heading}
            </h2>

            {/* Account Details Section */}
            <div className="bg-gray-100 p-6 lg:p-8 rounded-lg shadow-md text-black text-left w-full max-w-lg">
                <h3 className="text-lg lg:text-xl font-semibold mb-4">
                    Account Details:
                </h3>
                <p className="whitespace-pre-line leading-6">
                    <strong>Account Name:</strong> {accountDetails.accountName}<br />
                    <strong>Account No.:</strong> {accountDetails.accountNumber}<br />
                    <strong>Bank:</strong> {accountDetails.bank}<br />
                    <strong>Branch:</strong> {accountDetails.branch}<br />
                    <strong>IFSC Code:</strong> {accountDetails.ifscCode}<br />
                    <strong>UPI ID:</strong> {accountDetails.upiId}
                </p>
            </div>

            {/* Sponsorship Links */}
            <p className="mt-6 text-black text-center text-sm lg:text-base">
                For more details about sponsorship,{" "}
                <a
                    href={sponsorshipLinks.link1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline hover:text-blue-600"
                >
                    {sponsorshipLinks.link1Text}
                </a>.
            </p>
            <p className="mt-4 text-black text-center text-sm lg:text-base">
                For more details about sponsorship,{" "}
                <a
                    href={sponsorshipLinks.link2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline hover:text-blue-600"
                >
                    {sponsorshipLinks.link2Text}
                </a>.
            </p>

            {/* Sponsor Image */}
            <div className="mt-6 w-full max-w-sm flex justify-center">
                <Image
                    src={imageSrc} // Use the imageSrc parameter
                    alt={`${heading} Support`}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover"
                />
            </div>
        </div>
    );

    // Define the account details, images, and links for each section
    const accountDetailsLeft: AccountDetails = {
        accountName: "Shiksha Mahakumbh",
        accountNumber: "42563560855",
        bank: "State Bank of India",
        branch: "Chandigarh Main Branch",
        ifscCode: "SBIN0000628",
        upiId: "shikshamahakumbh@sbi",
    };

    const accountDetailsRight: AccountDetails = {
        accountName: "Shiksha Kumbh",
        accountNumber: "42563561350",
        bank: "State Bank of India",
        branch: "Chandigarh Main Branch",
        ifscCode: "SBIN0000628",
        upiId: "shikshakhumbh@sbi",
    };

    const sponsorshipLinksLeft: SponsorshipLinks = {
        link1: "/2024K/Shiksha-Mahakumbh-25-sponsorship2.pdf",
        link1Text: "Sponsorship 1",
        link2: "/2024K/SM-25-sponsorship-3.pdf (1).pdf",
        link2Text: "Sponsorship 2",
    };

    const sponsorshipLinksRight: SponsorshipLinks = {
        link1: "/",
       
        link1Text: "Sponsorship 1",
        link2: "/",
        link2Text: "Sponsorship 2",
    };

    return (
        <div className="flex flex-col items-center">
            {/* Combined Heading */}
            <h1 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-8 mt-6">
                Join Us in Making a Difference - Support The Cause
            </h1>

            {/* Side-by-Side Sections */}
            <div className="flex flex-col lg:flex-row items-stretch w-full">
                {/* Left Section */}
                <div className="flex-1 bg-gray-50">
                    {renderSection(
                        "Shiksha Mahakumbh",
                        accountDetailsLeft,
                        "/2024K/Sponsor.png",
                        sponsorshipLinksLeft
                    )}
                </div>

                {/* Right Section */}
                <div className="flex-1 bg-gray-50">
                    {renderSection(
                        "Shiksha Kumbh",
                        accountDetailsRight,
                        "/sk.png",
                        sponsorshipLinksRight
                    )}
                </div>
            </div>
        </div>
    );
};

export default Donate;
