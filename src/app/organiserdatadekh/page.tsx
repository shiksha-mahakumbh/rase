"use client";

import { useState, useEffect } from "react";
import { message, Table, Spin, Button } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore as getFirestoreFromApp } from "firebase/firestore";
import { firebaseConfig } from "../firebase";
import * as XLSX from "xlsx"; // For Excel export
import jsPDF from "jspdf"; // For PDF export
import autoTable from "jspdf-autotable"; // For table support in jsPDF
import TopInfo from "../component/CompanyInfo";

// Define the structure of each registration
interface Registration {
  id: string;
  name: string;
  phone: string;
  designation: string;
  institution: string;
  duty: string;
  accommodation: string;
  stateCode: string;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestoreFromApp(app);

const DataPage = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "organiserregistration"));
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Registration[];

      setRegistrations(data);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching data. Please try again.");
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to export data as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Export file
    XLSX.writeFile(workbook, "RegistrationsData.xlsx");
  };

  // Function to export data as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["S.No", "Name", "Phone", "Designation", "Institution", "Duty", "Accommodation", "State Code"];
    const tableRows: any[] = [];

    registrations.forEach((reg, index) => {
      const rowData = [
        index + 1, // Serial number
        reg.name,
        reg.phone,
        reg.designation,
        reg.institution,
        reg.duty,
        reg.accommodation,
        reg.stateCode,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows, // Use tableRows directly
      theme: "grid",
    });

    doc.save("RegistrationsData.pdf");
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Designation', dataIndex: 'designation', key: 'designation' },
    { title: 'Institution', dataIndex: 'institution', key: 'institution' },
    { title: 'Duty', dataIndex: 'duty', key: 'duty' },
    { title: 'Accommodation', dataIndex: 'accommodation', key: 'accommodation' },
    { title: 'State Code', dataIndex: 'stateCode', key: 'stateCode' },
  ];

  return (
    <div className="bg-black">
      <TopInfo />
      <div className="bg-black container mx-auto p-8">
        <h1 className="text-primary text-2xl text-center font-bold mb-6">
          Organiser Registration Data
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="shadow-md rounded-md p-4 bg-white">
            <div className="flex justify-between mb-4">
              <Button type="primary" onClick={exportToExcel}>
                Export as Excel
              </Button>
              <Button type="primary" onClick={exportToPDF}>
                Export as PDF
              </Button>
            </div>
            <Table
              columns={[
                { title: 'S.No', render: (_, __, index) => index + 1, key: 'serial' }, // Add Serial Column
                ...columns,
              ]}
              dataSource={registrations}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              className="custom-table"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPage;
