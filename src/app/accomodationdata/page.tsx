"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import toast, { Toaster } from "react-hot-toast";

interface AccommodationData {
  name: string;
  email: string;
  ContactNumber: string;
  Designation: string;
  Delegate: string;
  Delegatetype: string;
  event: string;
  accommodationtype: string;
  accommodationdate: string;
  FeeReceipt: string;
}

const AccommodationPage: React.FC = () => {
  const [dataList, setDataList] = useState<AccommodationData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "Accomodation");
        const querySnapshot = await getDocs(colRef);

        const fetchedData: AccommodationData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push(doc.data() as AccommodationData);
        });

        setDataList(fetchedData);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "AccommodationData");
    XLSX.writeFile(workbook, "AccommodationData.xlsx");
    toast.success("Data exported to Excel!");
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF("landscape");
    const tableColumn = [
      "Name",
      "Email",
      "Contact Number",
      "Designation",
      "Delegate",
      "Delegate Type",
      "Event",
      "Accommodation Type",
      "Accommodation Date",
      "Fee Receipt",
    ];
    const tableRows: any[][] = [];

    dataList.forEach((data) => {
      tableRows.push([
        data.name,
        data.email,
        data.ContactNumber,
        data.Designation,
        data.Delegate,
        data.Delegatetype,
        data.event,
        data.accommodationtype,
        data.accommodationdate,
        data.FeeReceipt,
      ]);
    });

    doc.text("Accommodation Data", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
    });

    doc.save("AccommodationData.pdf");
    toast.success("Data exported to PDF!");
  };

  const generateQRCode = async (data: AccommodationData) => {
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
      <h1 className="text-xl font-bold text-center mb-4">Accommodation Data</h1>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Contact Number</th>
            <th className="border px-4 py-2">Designation</th>
            <th className="border px-4 py-2">Delegate</th>
            <th className="border px-4 py-2">Delegate Type</th>
            <th className="border px-4 py-2">Event</th>
            <th className="border px-4 py-2">Accommodation Type</th>
            <th className="border px-4 py-2">Accommodation Date</th>
            <th className="border px-4 py-2">Fee Receipt</th>
            <th className="border px-4 py-2">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.ContactNumber}</td>
              <td className="border px-4 py-2">{item.Designation}</td>
              <td className="border px-4 py-2">{item.Delegate}</td>
              <td className="border px-4 py-2">{item.Delegatetype}</td>
              <td className="border px-4 py-2">{item.event}</td>
              <td className="border px-4 py-2">{item.accommodationtype}</td>
              <td className="border px-4 py-2">{item.accommodationdate}</td>
              <td className="border px-4 py-2">{item.FeeReceipt}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-500"
                  onClick={() => generateQRCode(item)}
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

export default AccommodationPage;
