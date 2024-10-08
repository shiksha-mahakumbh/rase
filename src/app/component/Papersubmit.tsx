import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PaperSubmission = () => {
    interface DateInfo {
        label?: string;
        date?: string;
        late?: string;
        chit: string;
        chat: JSX.Element;
        chat1: JSX.Element;
    }

    const delegates: DateInfo[] = [
        {
            label: "Research Scholars and Students",
            date: "₹ 1100",
            late: " ₹ 1500",
            chit: "",
            chat: <></>,
            chat1: <></>,
        },
        {
            label: "Academics, R&D and Institutions",
            date: "₹ 2100",
            late: " ₹ 2500",
            chit: "",
            chat: <></>,
            chat1: <></>,
        }, 
        {
            label: "Industry",
            date: "₹ 3100",
            late: " ₹ 3500",       
            chit: "",
            chat: <></>,
            chat1: <></>,
        }
    ];

    interface PaperInfo {
        chit: string;
        chat: JSX.Element;
        chat1: JSX.Element;
    }

    const papers: PaperInfo[] = [
        {
            chit: "Abstract",
            chat: <Link className="mt-4 text-justify text-primary whitespace-pre-line underline" href="https://forms.gle/zAJM67umEEL1fHTT8">Click here to submit Abstract</Link>,
            chat1: <a className="mt-4 text-justify text-primary whitespace-pre-line underline" href='/abstract.docx'>Click here to view the Abstract Template</a>
        },
        {
            chit: "Full Length Paper",
            chat: <Link className="mt-4 text-justify text-primary whitespace-pre-line underline" href="https://forms.gle/9CS4ScXJYZCsTpbt7">Click here to submit full Length paper</Link>,
            chat1: <a className="mt-4 text-justify text-primary whitespace-pre-line underline" href='/Full_Length_Paper_Template.docx'>Click here to view the Full Length Paper Template</a>
        },
    ];

    const about = `Selected papers post peer review of Conference Editorial Board and concerned Journal Editorial Board will be published in Scopus/UGC Care indexed journals. The papers not selected in any of the above two will be given space either in an emerging peer reviewed Viksit India journal or Book Chapter in a peer reviewed ISBN number book. All the received abstracts within time limit and with registration fee will be published in peer reviewed Conference Proceeding with ISBN number. 1st, 2nd, and 3rd prizes of ₹21K, ₹11K & ₹5K will be given. 5 consolation prizes of ₹3K each will be provided.`;

    return (
        <div className="bg-white p-6">
            <h2 className="text-xl font-semibold text-primary">
                Paper Registration
            </h2>
            <p className="mt-4 text-justify text-black whitespace-pre-line">
                <b dangerouslySetInnerHTML={{ __html: about }} />
            </p>
            <p className="mt-4 text-justify text-primary whitespace-pre-line underline ">
                <Link href="/topics">For more details on the topics, please click here.</Link>
            </p>
            <div className='flex flex-row justify-between flex-wrap m-auto'>
                <table className="table-fixed my-5 m-auto md:w-1/2 lg:w-90 h-auto">
                    <thead>
                        <tr className="bg-primary">
                            <th className="w-1/3 p-2 border text-left text-white">DELEGATES</th>
                            <th className="w-1/3 p-2 border text-left text-white">REGULAR</th>
                            <th className="w-1/3 p-2 border text-left text-white">LATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {delegates.map((member, index) => (
                            <tr key={index}>
                                <td className="p-2 border text-left text-black">{member.label}</td>
                                <td className="p-2 border text-left text-black">{member.date}</td>
                                <td className="p-2 border text-left text-black">{member.late}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='text-black flex flex-col justify-center m-auto'>
                    <h2>UPI ID: <b>shikshakhumb@sbi</b> </h2>
                    <Image className='m-auto'
                        src="/2024K/Qrcode.png"
                        alt="Sponsor Image"
                        width={200}
                        height={200}
                    />
                </div>
            </div>
            <p className="mt-4 text-justify text-black ">
                The registration fee is to be paid online through RTGS/NEFT/ IMPS/UPI/DD in favor of “Shiksha Kumbh”,<b> Account No. 42563561350 of State Bank of India, Chandigarh Branch (IFSC Code: SBIN0000628).</b>
                The filled in registration form along with the payment receipt should be sent to Convener <b>RASE-2024,</b> Department of Holistic Education, Vidya Bharti, Plot No. 1, Sector 71, Sahibzada Ajit Singh Nagar, Punjab-160071.
            </p>
            
            <table className="table-fixed max-width my-5 m-auto">
                <thead>
                    <tr className="bg-primary">
                        <th className="w-1/3 p-2 border text-left text-white">Papers</th>
                        <th className="w-1/3 p-2 border text-left text-white">Submission link</th>
                        <th className="w-1/3 p-2 border text-left text-white">Template</th>
                    </tr>
                </thead>
                <tbody>
                    {papers.map((member, index) => (
                        <tr key={index}>
                            <td className="p-2 border text-left text-black">{member.chit}</td>
                            <td className="p-2 border text-left text-black">{member.chat}</td>
                            <td className="p-2 border text-left text-black">{member.chat1}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PaperSubmission;
