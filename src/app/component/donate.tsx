import React from 'react';
import Image from 'next/image';

const Sponsor: React.FC = () => {
    return (
        <div className="flex flex-col mt-6 justify-center items-center h-full">
            <h2 className="text-xl font-semibold text-primary">
                Support a Cause That Matters
            </h2>
            <p className="mt-4 text-justify text-black whitespace-pre-line">
                Account Details:
                <br />
                Account Name: Shiksha Kumbh
                <br />
                Account No.: 42563561350
                <br />
                Bank: State Bank of India
                <br />
                Branch: Chandigarh Main Branch
                <br />
                IFSC Code: SBIN0000628
                <br />
                UPI ID: shikshakhumb@sbi
            </p>
            <br />
            <Image
                src="/2024K/Sponsor.png"
                alt="Sponsor Image"
                width={300}
                height={300}
            />
            <p className="mt-4 text-justify text-black whitespace-pre-line">For more details about Sponsorship, <a className=' font-semibold text-primary' href='/rase.pdf'>Click here</a></p>
        </div>
    );
}

export default Sponsor;