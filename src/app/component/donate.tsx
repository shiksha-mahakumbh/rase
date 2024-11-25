import React from 'react';
import Image from 'next/image';

const Donate: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full mt-6 px-4">
            {/* Section Header */}
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">
                Support a Cause That Matters
            </h2>

            {/* Account Details Section */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-black text-left">
                <h3 className="text-lg font-semibold mb-2">Account Details:</h3>
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
            <div className="mt-6">
                <Image
                    src="/2024K/Sponsor.png" // Image path should be in the public folder
                    alt="Support Shiksha Kumbh"
                    width={300}
                    height={300}
                    className="rounded-lg"
                />
            </div>

            {/* Sponsorship Link */}
            <p className="mt-6 text-black text-center">
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
            <p className="mt-6 text-black text-center">
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
