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

interface FullLengthPaperFormDataSM {
    serial?: number;
    PaperTitle: string;
    CorrespondingAuthorEmail: string;
    CorrespondingAuthorName: string;
    CoauthorNames?: string;
    CoauthorEmail?: string;
    Keywords: string;
    ContactNumber: string;
    AttachmentsWord: string | null;
    AttachmentsPdf: string | null;
    AttachmentsPpt: string | null;
    FeeReceipt: string | null;
  }
const Page: React.FC = () => {
  const { Canvas } = useQRCode();
  const [formDataList, setFormDataList] = useState<FullLengthPaperFormDataSM[]>([]);
  const [emailsSent, setEmailsSent] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "FullLengthSubmissionDataSM24");
        const querySnapshot = await getDocs(colRef);

        const dataList: FullLengthPaperFormDataSM[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as FullLengthPaperFormDataSM;
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

  const sendEmail = async (email: string, formData: FullLengthPaperFormDataSM) => {
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
        await sendEmail(formData.CorrespondingAuthorEmail, formData);
        const updatedEmailsSent = [...emailsSent];
        updatedEmailsSent[index] = true;
        setEmailsSent(updatedEmailsSent);
      }
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(formDataList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FullLengthSubmissionDataSM24");
    XLSX.writeFile(workbook, "Full_Length_Paper_Data.xlsx");
  };

  const downloadAsPDF = async (formDataList: FullLengthPaperFormDataSM[]) => {
    const doc = new jsPDF("landscape");

    const tableColumn = ["serial", "name", "email", "ContactNumber"];
    const tableRows: any[][] = [];

    formDataList.forEach((formData) => {
      const data = [
        formData.serial?.toString(),
        formData.CorrespondingAuthorName,
        formData.CorrespondingAuthorEmail,
        formData.ContactNumber,
      ];
      tableRows.push(data);
    });
    const pageHeight = doc.internal.pageSize.height;
    let currentY = 40;
    let currentRow = 0;

    const addQRCodeForRow = async (formData: FullLengthPaperFormDataSM, yPos: number) => {
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

    doc.save("FullLengthPaper_data.pdf");
  };

  const downloadPDF = () => {
    downloadAsPDF(formDataList);
  };

  return (
    <div className="bg-white w-auto min-h-screen flex flex-col justify-center items-center mt-4 flex-wrap">
      <Toaster />
      <h2 className="text-primary text-xl font-bold">
        Full Length Paper Submission Data
      </h2>
      <table className="border-collapse border m-6">
        <thead>
          <tr>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Sr. No.
            </th>
          
            <th className="border bg-primary text-white font-bold text-base p-3">
              Paper Title
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              CorrespondingAuthorName
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              CorrespondingAuthorEmail
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              CoauthorNames
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              CoauthorEmail
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Contact Number
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              Keywords
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              AbstractWord
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              AbstractPdf
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              AbstractPpt
            </th>
            <th className="border bg-primary text-white font-bold text-base p-3">
              FeeReceipt
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
              <td className="border text-black p-3">{formData.PaperTitle}</td>
              <td className="border text-black p-3">
                {formData.CorrespondingAuthorName}
              </td>
              <td className="border text-black p-3">
                {formData.CorrespondingAuthorEmail}
              </td>
              <td className="border text-black p-3">{formData.CoauthorNames}</td>
              <td className="border text-black p-3">{formData.CoauthorEmail}</td>
              <td className="border text-black p-3">{formData.ContactNumber}</td>
              <td className="border text-black p-3">{formData.Keywords}</td>
              <td className="border text-black p-3">{formData.AttachmentsWord}</td>
              <td className="border text-black p-3">{formData.AttachmentsPdf}</td>
              <td className="border text-black p-3">{formData.AttachmentsPpt}</td>
              <td className="border text-black p-3">{formData.FeeReceipt}</td>
              
              <td className="border text-black p-3">
                {formData.CorrespondingAuthorName ? (
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
                  onClick={() => sendEmail(formData.CorrespondingAuthorEmail, formData)}
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
