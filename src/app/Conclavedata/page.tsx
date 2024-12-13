'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import toast, { Toaster } from 'react-hot-toast';

interface ConclaveData {
  serial?: number;
  typeofConclave: string;
  name: string;
  designation: string;
  institutionName: string;
  email: string;
  contactNumber: string;
  address: string;
  views: string;
  accommodation: string;
}

const ConclaveDataPage: React.FC = () => {
  const [dataList, setDataList] = useState<ConclaveData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, 'ConclaveRegistrations');
        const querySnapshot = await getDocs(colRef);
        const fetchedData: ConclaveData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as ConclaveData;
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ConclaveData');
    XLSX.writeFile(workbook, 'ConclaveData.xlsx');
    toast.success('Data exported to Excel!');
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF('landscape');
    const tableColumn = [
      'Serial',
      'Type',
      'Institution Name',
      'Name',
      'Designation',
      'Email',
      'Contact Number',
      'Views',
      'Accommodation',
    ];
    const tableRows: any[][] = [];
    dataList.forEach((data) => {
      tableRows.push([
        data.serial,
        data.typeofConclave,
        data.institutionName,
        data.name,
        data.designation,
        data.email,
        data.contactNumber,
        data.views,
        data.accommodation,
      ]);
    });

    doc.text('Conclave Registrations', 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('ConclaveData.pdf');
    toast.success('Data exported to PDF!');
  };

  const generateQRCode = async (data: ConclaveData) => {
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
      <h1 className="text-xl font-bold text-center mb-4">Conclave Data</h1>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Serial</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Institution Name</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Designation</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Contact Number</th>
            <th className="border px-4 py-2">Views</th>
            <th className="border px-4 py-2">Accommodation</th>
            <th className="border px-4 py-2">QR Code</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.serial}>
              <td className="border px-4 py-2">{item.serial}</td>
              <td className="border px-4 py-2">{item.typeofConclave}</td>
              <td className="border px-4 py-2">{item.institutionName}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.designation}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.contactNumber}</td>
              <td className="border px-4 py-2">{item.views}</td>
              <td className="border px-4 py-2">{item.accommodation}</td>
              
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

export default ConclaveDataPage;
