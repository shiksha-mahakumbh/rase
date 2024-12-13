"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";

interface NgoData {
  projectName: string;
  projectDescription: string;
  instituteName: string;
  instituteAddress: string;
  projectPptUrl: string | null;
  projectVideoUrl: string | null;
  feeReceiptUrl: string | null;
  serial?: number;
}

const Page: React.FC = () => {
  const [formDataList, setFormDataList] = useState<NgoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "heiprojectformdata");
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      formDataList.map(({ projectName, projectDescription, instituteName, instituteAddress, projectPptUrl, projectVideoUrl, feeReceiptUrl, serial }) => ({
        serial,
        projectName,
        projectDescription,
        instituteName,
        instituteAddress,
        projectPptUrl: projectPptUrl || "No link",
        projectVideoUrl: projectVideoUrl || "No link",
        feeReceiptUrl: feeReceiptUrl || "No link",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "heiprojectformdata");
    XLSX.writeFile(workbook, "HeiProjectRegistrationData.xlsx");
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF();
    const tableColumn = ["Sr. No.", "Project Name", "Description", "Institute Name", "Address", "PPT", "Video", "Fee Receipt"];
    const tableRows: any[][] = [];

    formDataList.forEach((formData) => {
      const data = [
        formData.serial,
        formData.projectName,
        formData.projectDescription,
        formData.instituteName,
        formData.instituteAddress,
        formData.projectPptUrl || "No link",
        formData.projectVideoUrl || "No link",
        formData.feeReceiptUrl || "No link",
      ];
      tableRows.push(data);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("HeiProjectRegistrationData.pdf");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center mt-4 flex-wrap">
      <Toaster />
      <h2 className="text-primary text-xl font-bold">HEI Project Registration Data</h2>
      <table className="border-collapse border m-6">
        <thead>
          <tr>
            <th className="border bg-primary text-white font-bold text-base p-3">Sr. No.</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Project Name</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Description</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Institute Name</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Address</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Project PPT</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Project Video</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Fee Receipt</th>
          </tr>
        </thead>
        <tbody>
          {formDataList.map((formData, index) => (
            <tr key={index} className="border">
              <td className="border text-black p-3">{index + 1}</td>
              <td className="border text-black p-3">{formData.projectName}</td>
              <td className="border text-black p-3">{formData.projectDescription}</td>
              <td className="border text-black p-3">{formData.instituteName}</td>
              <td className="border text-black p-3">{formData.instituteAddress}</td>
              <td className="border text-black p-3">
                {formData.projectPptUrl ? <a href={formData.projectPptUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No File"}
              </td>
              <td className="border text-black p-3">
                {formData.projectVideoUrl ? <a href={formData.projectVideoUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No File"}
              </td>
              <td className="border text-black p-3">
                {formData.feeReceiptUrl ? <a href={formData.feeReceiptUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No File"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={exportToExcel} className="bg-primary text-white font-bold py-2 px-4 rounded mt-4">
        Export to Excel
      </button>
      <button onClick={downloadAsPDF} className="bg-primary text-white font-bold py-2 px-4 rounded mt-4 cursor-pointer">
        Export to PDF
      </button>
    </div>
  );
};

export default Page;
