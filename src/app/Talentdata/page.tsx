'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import toast, { Toaster } from 'react-hot-toast';

interface TalentData {
  serial?: number;
  name: string;
  talentName: string;
  institutionName: string;
  talentType: string;
  email: string;
  contactNumber: string;
  description: string;
  attachment?: string; // The URL for the uploaded file
  accommodation: string;
}

const TalentDataPage: React.FC = () => {
  const [dataList, setDataList] = useState<TalentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, 'talent');
        const querySnapshot = await getDocs(colRef);
        const fetchedData: TalentData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as TalentData;
          fetchedData.push({ ...data, serial: fetchedData.length + 1 });
        });
        setDataList(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data!');
      }
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TalentData');
    XLSX.writeFile(workbook, 'TalentData.xlsx');
    toast.success('Data exported to Excel!');
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF('landscape');
    const tableColumn = [
      'Serial',
      'Name',
      'Talent Name',
      'Talent Type',
      'Institution Name',
      'Email',
      'Contact Number',
      'Description',
      'Attachment',
      'Accommodation',
    ];
    const tableRows: any[][] = [];
    dataList.forEach((data) => {
      tableRows.push([
        data.serial,
        data.name,
        data.talentName,
        data.talentType,
        data.institutionName,
        data.email,
        data.contactNumber,
        data.description,
        data.attachment ? `<a href="${data.attachment}" target="_blank">View</a>` : 'No Attachment',
        data.accommodation,
      ]);
    });

    doc.text('Talent Registrations', 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('TalentData.pdf');
    toast.success('Data exported to PDF!');
  };

  const generateQRCode = async (data: TalentData) => {
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
      console.error('Error generating QR Code:', error);
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="text-xl font-bold text-center mb-4">Talent Data</h1>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Serial</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Talent Name</th>
            <th className="border px-4 py-2">Talent Type</th>
            <th className="border px-4 py-2">Institution Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Contact Number</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Attachment</th>
            <th className="border px-4 py-2">Accommodation</th>
            <th className="border px-4 py-2">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.serial}>
              <td className="border px-4 py-2">{item.serial}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.talentName}</td>
              <td className="border px-4 py-2">{item.talentType}</td>
              <td className="border px-4 py-2">{item.institutionName}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.contactNumber}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">
                {item.attachment ? (
                  <a href={item.attachment} target="_blank" className="text-blue-500">
                    View
                  </a>
                ) : (
                  'No Attachment'
                )}
              </td>
              <td className="border px-4 py-2">{item.accommodation}</td>
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

export default TalentDataPage;
