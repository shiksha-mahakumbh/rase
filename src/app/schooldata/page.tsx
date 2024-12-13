"use client";

import React, { useEffect, useState } from "react";
import { db, storage } from "@/app/firebase"; // Ensure your firebase config includes storage
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";

interface Participant {
  name: string;
  phone: string;
  email: string;
  class: string;
}

interface NgoData {
  projectName: string;
  projectDescription: string;
  schoolName: string;
  schoolAddress: string;
  teamSize: number;
  participants: Participant[];
  projectPptUrl?: string | null;
  projectVideoUrl?: string | null;
  feeReceiptUrl?: string | null;
  serial?: number;
}

const Page: React.FC = () => {
  const [formDataList, setFormDataList] = useState<NgoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "SchoolProjectFormdata");
        const querySnapshot = await getDocs(colRef);

        const dataList: NgoData[] = [];
        const downloadURLPromises: Promise<void>[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as NgoData;

          // Update file URLs
          downloadURLPromises.push(
            (async () => {
              if (data.projectPptUrl) {
                const pptRef = ref(storage, data.projectPptUrl);
                data.projectPptUrl = await getDownloadURL(pptRef);
              }
              if (data.projectVideoUrl) {
                const videoRef = ref(storage, data.projectVideoUrl);
                data.projectVideoUrl = await getDownloadURL(videoRef);
              }
              if (data.feeReceiptUrl) {
                const feeRef = ref(storage, data.feeReceiptUrl);
                data.feeReceiptUrl = await getDownloadURL(feeRef);
              }
              dataList.push(data);
            })()
          );
        });

        await Promise.all(downloadURLPromises);

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
      formDataList.map(({ projectName, projectDescription, schoolName, schoolAddress, teamSize, participants, projectPptUrl, projectVideoUrl, feeReceiptUrl, serial }) => ({
        serial,
        projectName,
        projectDescription,
        schoolName,
        schoolAddress,
        teamSize,
        participants: participants.map((p) => p.name).join(", "),
        projectPptUrl: projectPptUrl || "No link",
        projectVideoUrl: projectVideoUrl || "No link",
        feeReceiptUrl: feeReceiptUrl || "No link",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SchoolProjectFormdata");
    XLSX.writeFile(workbook, "SchoolProjectFormdata.xlsx");
  };

  const downloadAsPDF = async () => {
    const doc = new jsPDF();
    const tableColumn = ["Sr. No.", "Project Name", "Description", "School Name", "Address", "Team Size", "Participants", "PPT", "Video", "Fee Upload"];
    const tableRows: any[][] = [];

    formDataList.forEach((formData) => {
      const data = [
        formData.serial,
        formData.projectName,
        formData.projectDescription,
        formData.schoolName,
        formData.schoolAddress,
        formData.teamSize,
        formData.participants.map((p) => p.name).join(", "),
        formData.projectPptUrl || "No file",
        formData.projectVideoUrl || "No file",
        formData.feeReceiptUrl || "No file",
      ];
      tableRows.push(data);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("ParticipantRegistrationData.pdf");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center mt-4 flex-wrap">
      <Toaster />
      <h2 className="text-primary text-xl font-bold">School Project Registration Data</h2>
      <table className="border-collapse border m-6">
        <thead>
          <tr>
            <th className="border bg-primary text-white font-bold text-base p-3">Sr. No.</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Project Name</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Description</th>
            <th className="border bg-primary text-white font-bold text-base p-3">School Name</th>
            <th className="border bg-primary text-white font-bold text-base p-3">School Address</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Team Size</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Participants</th>
            <th className="border bg-primary text-white font-bold text-base p-3">PPT</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Video</th>
            <th className="border bg-primary text-white font-bold text-base p-3">Fee Upload</th>
          </tr>
        </thead>
        <tbody>
          {formDataList.map((formData, index) => (
            <tr key={index} className="border">
              <td className="border text-black p-3">{formData.serial}</td>
              <td className="border text-black p-3">{formData.projectName}</td>
              <td className="border text-black p-3">{formData.projectDescription}</td>
              <td className="border text-black p-3">{formData.schoolName}</td>
              <td className="border text-black p-3">{formData.schoolAddress}</td>
              <td className="border text-black p-3">{formData.teamSize}</td>
              <td className="border text-black p-3">{formData.participants.map((p) => p.name).join(", ")}</td>
              <td className="border text-black p-3">
                {formData.projectPptUrl ? <a href={formData.projectPptUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No file"}
              </td>
              <td className="border text-black p-3">
                {formData.projectVideoUrl ? <a href={formData.projectVideoUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No file"}
              </td>
              <td className="border text-black p-3">
                {formData.feeReceiptUrl ? <a href={formData.feeReceiptUrl} target="_blank" rel="noopener noreferrer">Download</a> : "No file"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-x-4">
        <button onClick={exportToExcel} className="bg-primary text-white px-4 py-2 rounded-md">Export to Excel</button>
        <button onClick={downloadAsPDF} className="bg-primary text-white px-4 py-2 rounded-md">Download as PDF</button>
      </div>
    </div>
  );
};

export default Page;
