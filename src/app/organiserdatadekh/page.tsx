"use client";

import { useEffect, useState } from "react";
import { message, Table, Spin, Button } from "antd";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TopInfo from "../component/CompanyInfo";
import {
  useAdminRegistrationData,
  rowToLegacyRecord,
} from "@/lib/legacy/useAdminRegistrationData";

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

const DataPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { rows, loading } = useAdminRegistrationData("Organiser");

  useEffect(() => {
    if (loading) return;
    const data = rows.map((row) => {
      const legacy = rowToLegacyRecord(row) as Record<string, unknown>;
      return {
        id: String(legacy.id ?? row.id),
        name: String(legacy.name ?? legacy.fullName ?? ""),
        phone: String(legacy.phone ?? legacy.contactNumber ?? ""),
        designation: String(legacy.designation ?? ""),
        institution: String(legacy.institution ?? ""),
        duty: String(legacy.duty ?? ""),
        accommodation: String(legacy.accommodation ?? legacy.accommodationRequired ?? ""),
        stateCode: String(legacy.stateCode ?? ""),
      };
    });
    setRegistrations(data);
  }, [rows, loading]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(registrations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "RegistrationsData.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "S.No",
      "Name",
      "Phone",
      "Designation",
      "Institution",
      "Duty",
      "Accommodation",
      "State Code",
    ];
    const tableRows = registrations.map((reg, index) => [
      index + 1,
      reg.name,
      reg.phone,
      reg.designation,
      reg.institution,
      reg.duty,
      reg.accommodation,
      reg.stateCode,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.save("RegistrationsData.pdf");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "Institution", dataIndex: "institution", key: "institution" },
    { title: "Duty", dataIndex: "duty", key: "duty" },
    { title: "Accommodation", dataIndex: "accommodation", key: "accommodation" },
    { title: "State Code", dataIndex: "stateCode", key: "stateCode" },
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
                { title: "S.No", render: (_, __, index) => index + 1, key: "serial" },
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
