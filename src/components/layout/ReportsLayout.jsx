import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import ReportsNav from "../reports/ReportsNav";

const ReportsLayout = () => {
  const location = useLocation();
  const isMainReportsPage = location.pathname === "/admin/reports";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#14213D] to-[#223867] shadow-md">
        <div className="container mx-auto px-4">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              Reports Dashboard
            </h1>
            <p className="text-gray-200 mt-1">
              View, analyze, and export your expense data
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isMainReportsPage && <ReportsNav />}

        <div className="bg-white rounded-lg shadow-md p-6">
          <Outlet />
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-medium text-[#14213D] mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center px-3 py-2 text-sm bg-[#14213D] text-white rounded-md hover:bg-opacity-90 transition-colors">
              <FaFileAlt className="mr-2" />
              Export All Reports
            </button>
            <button className="flex items-center px-3 py-2 text-sm border border-[#FCA311] text-[#FCA311] rounded-md hover:bg-[#FCA311] hover:text-white transition-colors">
              <FaCalendarAlt className="mr-2" />
              Schedule Reports
            </button>
            <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <FaChartLine className="mr-2" />
              Create Custom Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsLayout;
