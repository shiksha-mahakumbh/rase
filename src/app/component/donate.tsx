import React from 'react';
import Image from 'next/image';

const Donate: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-6 px-4 lg:px-8">
            {/* Section Header */}
            <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6 text-center">
                Support a Cause That Matters
            </h2>

            {/* Account Details Section */}
            <div className="bg-gray-100 p-6 lg:p-8 rounded-lg shadow-md text-black text-left w-full max-w-lg">
                <h3 className="text-lg lg:text-xl font-semibold mb-4">
                    Account Details:
                </h3>
                <p className="whitespace-pre-line leading-6">
                    <strong>Account Name:</strong> Shiksha Mahakumbh<br />
                    <strong>Account No.:</strong> 42563560855<br />
                    <strong>Bank:</strong> State Bank of India<br />
                    <strong>Branch:</strong> Chandigarh Main Branch<br />
                    <strong>IFSC Code:</strong> SBIN0000628<br />
                    <strong>UPI ID:</strong> shikshamahakumbh@sbi
                </p>
            </div>

            {/* Sponsor Image */}
            <div className="mt-6 w-full max-w-sm flex justify-center">
                <Image
                    src="/2024K/Sponsor.png" // Image path should be in the public folder
                    alt="Support Shiksha Kumbh"
                    width={300}
                    height={300}
                    className="rounded-lg object-cover"
                />
            </div>

            {/* Sponsorship Links */}
            <p className="mt-6 text-black text-center text-sm lg:text-base">
                For more details about sponsorship 1,{" "}
                <a
                    href="/2024K/Shiksha Mahakumbh-sponsorship 2.pdf (1).pdf" // Ensure this file exists in the public folder
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline hover:text-blue-600"
                >
                    click here
                </a>.
            </p>
            <p className="mt-4 text-black text-center text-sm lg:text-base">
                For more details about sponsorship 2,{" "}
                <a
                    href="/2024K/Shiksha Mahakumbh-sponsorship 3.pdf (2).pdf" // Ensure this file exists in the public folder
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline hover:text-blue-600"
                >
                    click here
                </a>.
            </p>
        </div>
    );
};

export default Donate;
