"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
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
  projectPpt: File | null;
  projectVideo: File | null;
  feeUpload: File | null;
  serial?: number;
}

const Page: React.FC = () => {
  const [formDataList, setFormDataList] = useState<NgoData[]>([]);
  const [emailsSent, setEmailsSent] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, "SchoolProjectFormdata");
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      formDataList.map(({ projectName, projectDescription, schoolName, schoolAddress, teamSize, participants, projectPpt, projectVideo, feeUpload, serial }) => ({
        serial,
        projectName,
        projectDescription,
        schoolName,
        schoolAddress,
        teamSize,
        participants: participants.map(p => p.name).join(", "), // Join participant names
        projectPpt: projectPpt ? projectPpt.name : "",
        projectVideo: projectVideo ? projectVideo.name : "",
        feeUpload: feeUpload ? feeUpload.name : "",
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
        formData.participants.map(p => p.name).join(", "), // Join participant names
        formData.projectPpt ? formData.projectPpt.name : "",
        formData.projectVideo ? formData.projectVideo.name : "",
        formData.feeUpload ? formData.feeUpload.name : "",
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
              <td className="border text-black p-3">{formData.participants.map(p => p.name).join(", ")}</td>
              <td className="border text-black p-3">{formData.projectPpt ? formData.projectPpt.name : "No file"}</td>
              <td className="border text-black p-3">{formData.projectVideo ? formData.projectVideo.name : "No file"}</td>
              <td className="border text-black p-3">{formData.feeUpload ? formData.feeUpload.name : "No file"}</td>
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
