"use client"
import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import toast, { Toaster } from "react-hot-toast";

interface BestPracticeData {
  serial?: number;
  institutionName: string;
  aboutPractices: string;
  keyPerson: string;
  email: string;
  contactNumber: string;
  address: string;
  attachmentURL: string;
  accommodation: string; // Field for accommodation preference
}

const BestPracticesPage: React.FC = () => {
  const [dataList, setDataList] = useState<BestPracticeData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "BestPractices");
        const querySnapshot = await getDocs(colRef);

        const fetchedData: BestPracticeData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push(doc.data() as BestPracticeData);
        });

        const dataWithSerial = fetchedData.map((item, index) => ({
          ...item,
          serial: index + 1,
        }));
        setDataList(dataWithSerial);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data!");
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BestPracticesData");
    XLSX.writeFile(workbook, "BestPracticesData.xlsx");
    toast.success("Data exported to Excel!");
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF("landscape");
    const tableColumn = [
      "Serial",
      "Institution Name",
      "About Practices",
      "Key Person",
      "Email",
      "Address",
      "Attachment",
      "Contact Number",
      "Accommodation",
    ];
    const tableRows: any[][] = [];

    dataList.forEach((data) => {
      tableRows.push([
        data.serial,
        data.institutionName,
        data.aboutPractices,
        data.keyPerson,
        data.email,
        data.address,
        data.attachmentURL,
        data.contactNumber,
        data.accommodation,
      ]);
    });

    doc.text("Best Practices Data", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
    });

    doc.save("BestPracticesData.pdf");
    toast.success("Data exported to PDF!");
  };

  const generateQRCode = async (data: BestPracticeData) => {
    try {
      const qrData = await QRCode.toDataURL(JSON.stringify(data));
      const win = window.open();
      if (win) {
        win.document.write(
          `<img src="${qrData}" alt="QR Code" style="width: 300px; height: 300px;" />`
        );
        win.document.close();
      }
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="text-xl font-bold text-center mb-4">Best Practices Data</h1>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Serial</th>
            <th className="border px-4 py-2">Institution Name</th>
            <th className="border px-4 py-2">About Practices</th>
            <th className="border px-4 py-2">Key Person</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Attachment</th>
            <th className="border px-4 py-2">Contact Number</th>
            <th className="border px-4 py-2">Accommodation</th>
            <th className="border px-4 py-2">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.serial}>
              <td className="border px-4 py-2">{item.serial}</td>
              <td className="border px-4 py-2">{item.institutionName}</td>
              <td className="border px-4 py-2">{item.aboutPractices}</td>
              <td className="border px-4 py-2">{item.keyPerson}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.address}</td>
              <td className="border px-4 py-2">
                {item.attachmentURL ? (
                  <a href={item.attachmentURL} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                ) : (
                  "No Attachment"
                )}
              </td>
              <td className="border px-4 py-2">{item.contactNumber}</td>
              <td className="border px-4 py-2">{item.accommodation}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => generateQRCode(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Generate QR
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={downloadAsPDF}
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default BestPracticesPage;
