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

interface FormData {
    name: string;
    type: string;
    website: string;
    cont: string;
    role: string;
    email: string;
    contactNumber: string;
    feeReceipt: string;
    vb: string;
    feeAmount: number;
    serial?: number;
  }

const Page: React.FC = () => {
  const { Canvas } = useQRCode();
  const [formDataList, setFormDataList] = useState<FormData[]>(
    []
  );
  const [emailsSent, setEmailsSent] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "ParticipantReg");
        const querySnapshot = await getDocs(colRef);

        const dataList: FormData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as FormData;
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

  const sendEmail = async (
    email: string,
    formData: FormData
  ) => {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormData");
    XLSX.writeFile(workbook, "ParticipantRegistrationData.xlsx");
  };

  const downloadAsPDF = async (formDataList: FormData[]) => {
    const doc = new jsPDF("landscape");

    const tableColumn = ["serial", "name", "email", "ContactNumber"];
    const tableRows: any[][] = [];

    formDataList.forEach((formData) => {
      const data = [
        formData.serial?.toString(),
        formData.name,
        formData.type,
        formData.website,
        formData.cont,
        formData.role,
        formData.email,
        formData.contactNumber,
        formData.feeReceipt,
        formData.vb,
        formData.feeAmount,
      ];
      tableRows.push(data);
    });
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40;
    let currentRow = 0;

    const addQRCodeForRow = async (
      formData: FormData,
      yPos: number
    ) => {
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

    doc.save("NGORegistrationData_data.pdf");
  };

  const downloadPDF = () => {
    downloadAsPDF(formDataList);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center mt-4 flex-wrap">
      <Toaster />
      <h2 className="text-primary text-xl font-bold">
      Participant Registration Data
      </h2>
      <table className="border-collapse border m-6">
        <thead>
          <tr>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Sr. No.
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Name
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Type
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Website
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Contribution
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Role
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Email
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Contact Number
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Fee Receipt
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            VB
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
            Fee Amount
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
              <td className="border text-black p-3">{formData.name}</td>
              <td className="border text-black p-3">{formData.type}</td>
              <td className="border text-black p-3">{formData.website}</td>
              <td className="border text-black p-3">
                {formData.cont}
              </td>
              <td className="border text-black p-3">
                {formData.role}
              </td>
              <td className="border text-black p-3">
                {formData.email}
              </td>
              <td className="border text-black p-3">
                {formData.contactNumber}
              </td>
              <td className="border text-black p-3">
                {formData.feeReceipt}
              </td>
              <td className="border text-black p-3">
                {formData.vb}
              </td>
              <td className="border text-black p-3">
                {formData.feeAmount}
              </td>
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
