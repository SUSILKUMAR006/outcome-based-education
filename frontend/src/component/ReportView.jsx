import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReportView = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "http://localhost:4000";

  useEffect(() => {
    const getReportId = async () => {
      try {
        const response = await axios.get(`${url}/reports/get/${id}`);
        console.log("Fetched Report Data:", response.data);
        setReportData(response.data);
      } catch (error) {
        console.error("Report fetch error:", error);
        setError("Failed to load report. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getReportId();
  }, [id]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="bg-blue-100 min-h-screen pb-10 pt-2">
        <Navbar />
        <div className="text-center text-gray-600 mt-20 text-lg">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  // ✅ Check if report is empty or invalid
  if (error || !reportData) {
    return (
      <div className="bg-blue-100 min-h-screen pb-10 pt-2">
        <Navbar />
        <div className="text-center text-red-500 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
            <p className="text-gray-600">{error || "The requested report could not be found."}</p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Render the fetched HTML report
  return (
    <div className="bg-blue-100 min-h-screen pb-10 pt-2">
      <Navbar />
      <div className="px-3 lg:px-6 mt-6 mb-10">
        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto mb-4 flex gap-3 justify-end">
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Reports
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Report Container */}
        <div className="max-w-7xl mx-auto">
          <div 
            className="report-container bg-white rounded-lg shadow-2xl overflow-hidden"
            dangerouslySetInnerHTML={{ __html: reportData.report_html }}
          />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body {
            background: white;
          }
          .bg-blue-100 {
            background: white !important;
          }
          nav, button {
            display: none !important;
          }
          .report-container {
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
        
        .report-container {
          overflow-x: auto;
        }
        
        .report-container table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .report-container img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default ReportView;
