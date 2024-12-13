"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useQRCode } from "next-qrcode";
import QRCode from "qrcode";
import toast, { Toaster } from "react-hot-toast";

interface NgoData {
    serial?: number;
    name: string;
    Affiliation: string;
    email: string;
    PhoneNumber: string;
    Services: string;
    Attachments: string;
    accommodation: string; // New field for accommodation
  }
const Page: React.FC = () => {
  const { Canvas } = useQRCode();
  const [formDataList, setFormDataList] = useState<NgoData[]>([]);
  const [emailsSent, setEmailsSent] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "RegestrationVolsm24");
        const querySnapshot = await getDocs(colRef);

        const dataList: NgoData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as NgoData;
          dataList.push(data);
        });

        const dataListWithSerial = dataList.map((data, index) => ({
          ...data,
          serial: index + 1,
        }));

        setFormDataList(dataListWithSerial);
        setEmailsSent(Array(dataListWithSerial.length).fill(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sendEmail = async (email: string, formData: NgoData) => {
    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, formData }), // Include formData in the request body
      });
      const data = await response.json();
      console.log(data);
      toast.success(`Email sent to ${email}`);
      // Handle success or error response from the server
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(`Failed to send email to ${email}`);
      // Handle error
    }
  };

  const sendAllEmails = async () => {
    formDataList.forEach(async (formData, index) => {
      if (!emailsSent[index]) {
        await sendEmail(formData.email, formData);
        const updatedEmailsSent = [...emailsSent];
        updatedEmailsSent[index] = true;
        setEmailsSent(updatedEmailsSent);
      }
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formDataList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "RegestrationVolsm24");
    XLSX.writeFile(workbook, "Full_Length_Paper_Data.xlsx");
  };

  const downloadAsPDF = async (formDataList: NgoData[]) => {
    const doc = new jsPDF("landscape");

    const tableColumn = ["serial", "name", "email", "ContactNumber"];
    const tableRows: any[][] = [];

    formDataList.forEach((formData) => {
      const data = [
        formData.serial?.toString(),
        formData.name,
        formData.email,
        formData.PhoneNumber,
      ];
      tableRows.push(data);
    });
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40;
    let currentRow = 0;

    const addQRCodeForRow = async (formData: NgoData, yPos: number) => {
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, JSON.stringify(formData), {
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
      });
      const qrDataUrl = qrCanvas.toDataURL("image/png");
      doc.addImage(qrDataUrl, "PNG", 15, yPos - 3, 20, 20);
    };

    while (currentRow < formDataList.length) {
      // Add row to table
      autoTable(doc, {
        head: [tableColumn],
        body: [tableRows[currentRow]],
        startY: currentY,
        theme: "grid",
      });

      // Add QR code for the current row
      await addQRCodeForRow(formDataList[currentRow], currentY + 20);

      currentRow++;
      currentY += 40; // increase for the row height and space for QR code

      // Check if there's enough space for the next row and QR code
      if (currentY + 40 > pageHeight) {
        doc.addPage(); // No need to specify orientation here
        currentY = 40; // reset Y position for new page
      }
    }

    doc.save("Vounteer_Registration_Data.pdf");
  };

  const downloadPDF = () => {
    downloadAsPDF(formDataList);
  };

  return (
    <div className="bg-white w-auto min-h-screen flex flex-col justify-center items-center mt-4 flex-wrap">
      <Toaster />
      <h2 className="text-primary text-xl font-bold">
        Volunteer Registration Submission Data
      </h2>
      <table className="border-collapse border m-6">
        <thead>
          <tr>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Sr. No.
            </th>
          
            <th className="border bg-primary text-white font-bold text-base p-3">
              Affiliation
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Name
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              email
            </th>
          
            <th className="border bg-primary text-white font-bold text-base p-3">
              Contact Number
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Services
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Attachments
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Accommodation
            </th>            
            <th className="border bg-primary text-white font-bold text-base p-3">
              QR
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Email Send
            </th>
          </tr>
        </thead>
        <tbody>
          {formDataList.map((formData, index) => (
            <tr key={formData.serial} className="border">
              <td className="border text-black p-3">{index + 1}</td>
              <td className="border text-black p-3">{formData.Affiliation}</td>
              <td className="border text-black p-3">
                {formData.name}
              </td>
              <td className="border text-black p-3">
                {formData.email}
              </td>
              <td className="border text-black p-3">{formData.PhoneNumber}</td>
              <td className="border text-black p-3">{formData.Services}</td>
              <td className="border text-black p-3">{formData.Attachments}</td>
              <td className="border text-black p-3">{formData.accommodation}</td>
                         
              <td className="border text-black p-3">
                {formData.name ? (
                  <Canvas
                    text={JSON.stringify(formData)}
                    options={{
                      errorCorrectionLevel: "M",
                      margin: 3,
                      scale: 4,
                      width: 200,
                      color: {
                        dark: "#000000",
                        light: "#e8f0f0",
                      },
                    }}
                  />
                ) : (
                  <span>No data available</span>
                )}
              </td>
              <td className="border text-black p-3">
                <button
                  onClick={() => sendEmail(formData.email, formData)}
                  className={`bg-primary text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer ${
                    emailsSent[index] ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                  disabled={emailsSent[index]}
                >
                  Send Mail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={exportToExcel}
        className="bg-primary text-white font-bold py-2 px-4 rounded mt-4"
      >
        Export to Excel
      </button>
      <button
        onClick={downloadPDF}
        className="bg-primary text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer"
      >
        Export to PDF
      </button>
      <button
        onClick={sendAllEmails}
        className="bg-primary text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer"
      >
        Send Mails to All
      </button>
    </div>
  );
};

export default Page;
