"use client";
import React from "react";
import CompanyInfo from "../component/CompanyInfo";
import Footer from "../component/Footer";
import NavBar from "../component/NavBar";
import Proceeding1 from "../component/Proceeding1";
import { proceeding1Data } from "@/content/proceedings/proceeding1-data";

export default function Proceeding1Page() {
  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0">
        <div className="w-full sm:w-1/5" />
        <div className="w-full sm:w-3/5">
          <Proceeding1 data={proceeding1Data} />
        </div>
        <div className="w-full sm:w-1/5" />
      </div>
      <Footer />
    </div>
  );
}
