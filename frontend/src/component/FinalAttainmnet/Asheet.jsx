import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { assets } from "../../assets/assets";

const FASheet = () => {
  const [searchParams] = useSearchParams();
  const batch = searchParams.get("batch") || "";
  const subject = searchParams.get("subject") || "";
  const url = "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Store fetched data
  const [iat1Report, setIat1Report] = useState(null);
  const [iat2Report, setIat2Report] = useState(null);
  const [iat3Report, setIat3Report] = useState(null);
  const [endSemReport, setEndSemReport] = useState(null);

  const [iat1Surveys, setIat1Surveys] = useState([]);
  const [iat2Surveys, setIat2Surveys] = useState([]);
  const [iat3Surveys, setIat3Surveys] = useState([]);
  const [endSemSurveys, setEndSemSurveys] = useState([]);

  // Extract report data
  const iat1Data = iat1Report?.report_data;
  const iat2Data = iat2Report?.report_data;
  const iat3Data = iat3Report?.report_data;
  const endExamData = endSemReport?.report_data;
  const endSurvey = endSemReport?.report_data?.surveyFeedback;
  const coValues = Object.values(endSurvey?.coAverages || {});

  const internalAverage =
    (Number(iat1Data?.attainment?.levels?.co1) +
      Number(iat1Data?.attainment?.levels?.co2) +
      Number(iat2Data?.attainment?.levels?.co1) +
      Number(iat2Data?.attainment?.levels?.co2) +
      Number(iat3Data?.attainment?.levels?.co1) +
      Number(iat3Data?.attainment?.levels?.co1)) /
      6 || 0;

  const assignmentAverage =
    (Number(iat1Data?.attainment?.levels?.assignment1) +
      Number(iat1Data?.attainment?.levels?.assignment2) +
      Number(iat2Data?.attainment?.levels?.assignment1) +
      Number(iat2Data?.attainment?.levels?.assignment2) +
      Number(iat3Data?.attainment?.levels?.assignment1) +
      Number(iat3Data?.attainment?.levels?.assignment2)) /
      6 || 0;

  const endExamAverage =
    (Number(endExamData?.attainment?.levels?.co1) +
      Number(endExamData?.attainment?.levels?.co2) +
      Number(endExamData?.attainment?.levels?.co3) +
      Number(endExamData?.attainment?.levels?.co4) +
      Number(endExamData?.attainment?.levels?.co5) +
      Number(endExamData?.attainment?.levels?.co6)) /
      6 || 0;

  const endSurveyAvg =
    coValues.reduce((sum, val) => sum + Number(val || 0), 0) /
    (coValues.length || 1);

  const directWeighted =
    ((Number(internalAverage || 0) * 20) / 100 +
      (Number(assignmentAverage || 0) * 10) / 100 +
      (Number(endExamAverage || 0) * 70) / 100) *
    0.8;

  const overallCourseAttainment =
    directWeighted + (Number(endSurveyAvg || 0) * 20) / 100;

  const handleSaveFinal = async () => {
    if (!batch || !subject) {
      alert("Batch and subject are required to save.");
      return;
    }
    try {
      const payload = {
        batch,
        subject,
        data: {
          internalAverage: Number(internalAverage || 0),
          assignmentAverage: Number(assignmentAverage || 0),
          endExamAverage: Number(endExamAverage || 0),
          endSurveyAvg: Number(endSurveyAvg || 0),
          directWeighted: Number(directWeighted || 0),
          overallCourseAttainment: Number(overallCourseAttainment || 0),
          internalWeighted: Number((internalAverage || 0) * 0.2),
          assignmentWeighted: Number((assignmentAverage || 0) * 0.1),
          endExamWeighted: Number((endExamAverage || 0) * 0.7),
          internalReports: {
            iat1: iat1Data || null,
            iat2: iat2Data || null,
            iat3: iat3Data || null,
          },
          endExamReport: endExamData || null,
          surveys: {
            iat1: iat1Surveys || [],
            iat2: iat2Surveys || [],
            iat3: iat3Surveys || [],
            endSem: endSemSurveys || [],
          },
          savedAt: new Date().toISOString(),
        },
      };

      console.log("📤 Sending payload to backend:", payload);

      const res = await axios.post(`${url}/final-attainment/save`, payload);
      
      console.log("✅ Response from backend:", res.data);
      
      if (res.data?.success) {
        alert("✅ Final attainment saved successfully!");
      } else {
        alert(`❌ ${res.data?.message || "Unable to save final attainment."}`);
      }
    } catch (error) {
      console.error("❌ Error saving final attainment:", error);
      
      // Detailed error message
      if (error.response) {
        // Server responded with error
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(`❌ Error: ${error.response.data?.message || error.response.data?.error || 'Server error'}`);
      } else if (error.request) {
        // Request made but no response
        console.error("No response received:", error.request);
        alert("❌ Error: Cannot connect to server. Please ensure the backend is running on http://localhost:4000");
      } else {
        // Something else happened
        alert(`❌ Error: ${error.message}`);
      }
    }
  };

  // Extract survey feedback from reports (stored in report_data.surveyFeedback)
  const iat1SurveyFeedback = iat1Data?.surveyFeedback;
  const iat2SurveyFeedback = iat2Data?.surveyFeedback;
  const iat3SurveyFeedback = iat3Data?.surveyFeedback;
  const endSemSurveyFeedback = endExamData?.surveyFeedback;

  // Calculate survey average from survey responses if feedback not stored in report
  const calculateSurveyAverage = (surveys, coName) => {
    if (!surveys || surveys.length === 0) return 0;
    const coKey = coName.toLowerCase();
    const values = surveys
      .map((s) => s.feedback?.[coKey])
      .filter((v) => v !== undefined && v !== null && v !== "");
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => Number(a) + Number(b), 0);
    return (sum / values.length).toFixed(2);
  };


  // Fetch all required data
  useEffect(() => {
    const fetchData = async () => {
      if (!batch || !subject) {
        setError("Batch and subject are required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log("🔍 Fetching data for Batch:", batch, "Subject:", subject);

        // Fetch all reports
        const reportsResponse = await axios.get(`${url}/report/getAll`);
        const allReports = reportsResponse.data;
        

        // Filter reports by batch and subject
        const filteredReports = allReports.filter((report) => {
          const reportBatch = report.report_data?.batch?.trim().toLowerCase() || "";
          const reportSubject = report.report_data?.subject?.trim().toLowerCase() || "";
          return (
            reportBatch === batch.toLowerCase() &&
            reportSubject === subject.toLowerCase()
          );
        });

 

        // Get 3 internal exam reports (IAT-1, IAT-2, IAT-3)
        const iat1 = filteredReports.find(
          (r) =>
            r.report_type === "internal" &&
            r.report_data?.internalType === "IAT-1"
        );
        const iat2 = filteredReports.find(
          (r) =>
            r.report_type === "internal" &&
            r.report_data?.internalType === "IAT-2"
        );
        const iat3 = filteredReports.find(
          (r) =>
            r.report_type === "internal" &&
            r.report_data?.internalType === "IAT-3"
        );

        // Get 1 end semester exam report
        const endSem = filteredReports.find(
          (r) => r.report_type === "endsem"
        );

        // Store reports
        setIat1Report(iat1);
        setIat2Report(iat2);
        setIat3Report(iat3);
        setEndSemReport(endSem);

        // Count internal exams found
        let internalExamCount = 0;
        if (iat1) internalExamCount++;
        if (iat2) internalExamCount++;
        if (iat3) internalExamCount++;


        // Fetch surveys for each report
        const [iat1SurveyData, iat2SurveyData, iat3SurveyData, endSemSurveyData] =
          await Promise.all([
            iat1
              ? axios.get(`${url}/Survey/by-report/${iat1._id}`).catch(() => ({ data: [] }))
              : Promise.resolve({ data: [] }),
            iat2
              ? axios.get(`${url}/Survey/by-report/${iat2._id}`).catch(() => ({ data: [] }))
              : Promise.resolve({ data: [] }),
            iat3
              ? axios.get(`${url}/Survey/by-report/${iat3._id}`).catch(() => ({ data: [] }))
              : Promise.resolve({ data: [] }),
            endSem
              ? axios.get(`${url}/Survey/by-report/${endSem._id}`).catch(() => ({ data: [] }))
              : Promise.resolve({ data: [] }),
          ]);

        // Store surveys
        setIat1Surveys(iat1SurveyData.data);
        setIat2Surveys(iat2SurveyData.data);
        setIat3Surveys(iat3SurveyData.data);
        setEndSemSurveys(endSemSurveyData.data);

        // Count surveys
        let surveyCount = 0;
        if (iat1SurveyData.data.length > 0) surveyCount++;
        if (iat2SurveyData.data.length > 0) surveyCount++;
        if (iat3SurveyData.data.length > 0) surveyCount++;
        if (endSemSurveyData.data.length > 0) surveyCount++;




      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batch, subject]);

  if (loading) {
    return (
      <div className="bg-green-100 min-h-screen p-5">
        <Navbar />
        <div className="bg-white rounded shadow-lg p-6 mt-5 text-center">
          <p className="text-xl">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-green-100 min-h-screen p-5">
        <Navbar />
        <div className="bg-white rounded shadow-lg p-6 mt-5 text-center">
          <p className="text-xl text-red-500">{error}</p>
          <p className="mt-2 text-gray-600">
            Batch: {batch || "N/A"} | Subject: {subject || "N/A"}
          </p>
        </div>
      </div>
    );
  }

  // Count what was found
  const internalExamCount = [iat1Report, iat2Report, iat3Report].filter(Boolean).length;
  const endExamCount = endSemReport ? 1 : 0;
  const surveyCount = [
    iat1Surveys.length > 0,
    iat2Surveys.length > 0,
    iat3Surveys.length > 0,
    endSemSurveys.length > 0
  ].filter(Boolean).length;

  return (
    <div className="bg-green-100 min-h-screen px-3 py-5 lg:px-15" >
      <Navbar />


      <div className="bg-white rounded shadow-lg p-6 mt-5">
        <div className='flex justify-center'>
          <img src={assets.college_logo} className=" lg:h-15 mb-5" alt="College Logo" />
        </div>
        <h1 className=" text-xl lg:text-2xl font-bold mb-5 text-center">
          Final Attainment
        </h1>

        <div className="text-center text-gray-600 mb-5">
          <p>Batch: <strong>{batch}</strong> | Subject: <strong>{subject}</strong></p>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleSaveFinal}
            className="px-6 py-2 bg-green-600 text-white rounded shadow hover:shadow-lg"
          >
            Save Final Attainment
          </button>
        </div>



        {/* Display detailed information */}
        <div className="space-y-4">


          <div className="overflow-x-auto flex flex-col gap-20 justify-center">
            <table className="  border-collapse text-black lg:mx-10">
              <thead className=" text-black bg-amber-400 ">
                <tr>
                  <th className="px-4 py-2 border">    </th>
                  <th className="px-4 py-2 border">IAT - I</th>
                  <th className="px-4 py-2 border">IAT - II</th>
                  <th className="px-4 py-2 border">IAT - III</th>
                  <th className="px-4 py-2 border">Assignment 1</th>
                  <th className="px-4 py-2 border">Assignment 2</th>
                  <th className="px-4 py-2 border">Assignment 3</th>
                  <th className="px-4 py-2 border">Internal</th>
                  <th className="px-4 py-2 border">Assignment</th>
                  <th className="px-4 py-2 border">University</th>
                  <th className="px-4 py-2 border">Indirect (Course end survey)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">{iat1Data?.allCoCodes?.CO1 || iat1Data?.coCodes?.CO1 || "C103.1"}</td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat1SurveyFeedback?.coAverages?.co1 ||
                      endSemSurveyFeedback?.coAverages?.co1 ||
                      (iat1Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat1Surveys, ...endSemSurveys], "CO1") : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">{iat1Data?.allCoCodes?.CO2 || iat1Data?.coCodes?.CO2 || "C103.2"}</td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat1Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat1SurveyFeedback?.coAverages?.co2 ||
                      endSemSurveyFeedback?.coAverages?.co2 ||
                      (iat1Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat1Surveys, ...endSemSurveys], "CO2") : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">{iat2Data?.allCoCodes?.CO3 || iat2Data?.coCodes?.CO3 || "C103.3"}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co3 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat2SurveyFeedback?.coAverages?.co3 ||
                      endSemSurveyFeedback?.coAverages?.co3 ||
                      (iat2Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat2Surveys, ...endSemSurveys], "CO3") : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">{iat2Data?.allCoCodes?.CO4 || iat2Data?.coCodes?.CO4 || "C103.4"}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat2Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co4 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat2SurveyFeedback?.coAverages?.co4 ||
                      endSemSurveyFeedback?.coAverages?.co4 ||
                      (iat2Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat2Surveys, ...endSemSurveys], "CO4") : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">{iat3Data?.allCoCodes?.CO5 || iat3Data?.coCodes?.CO5 || "C103.5"}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.co1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.assignment1 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co5 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat3SurveyFeedback?.coAverages?.co5 ||
                      endSemSurveyFeedback?.coAverages?.co5 ||
                      (iat3Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat3Surveys, ...endSemSurveys], "CO5") : 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">{iat3Data?.allCoCodes?.CO6 || iat3Data?.coCodes?.CO6 || "C103.6"}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.co2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{iat3Data?.attainment?.levels?.assignment2 || 0}</td>
                  <td className="px-4 py-2 border text-center">{endExamData?.attainment?.levels?.co6 || 0}</td>
                  <td className="px-4 py-2 border text-center">
                    {iat3SurveyFeedback?.coAverages?.co6 ||
                      endSemSurveyFeedback?.coAverages?.co6 ||
                      (iat3Surveys.length > 0 || endSemSurveys.length > 0 ? calculateSurveyAverage([...iat3Surveys, ...endSemSurveys], "CO6") : 0)}
                  </td>
                </tr>
                <tr>

                  <td className="px-4 py-2 border text-end" colSpan={7}>Average</td>
                  <td className="px-4 py-2 border text-center">{(internalAverage).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(assignmentAverage).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(endExamAverage).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center " rowSpan={4}>{endSurveyAvg.toFixed(2)}</td>
                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Weightage</td>
                  <td className="px-4 py-2 border text-center">20%</td>
                  <td className="px-4 py-2 border text-center">10%</td>
                  <td className="px-4 py-2 border text-center">70%</td>

                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Attainment</td>
                  <td className="px-4 py-2 border text-center">{((internalAverage || 0) * 20 / 100).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((assignmentAverage || 0) * 10 / 100).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((endExamAverage || 0) * 70 / 100).toFixed(2)}</td>

                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Total Attainment</td>
                  <td className="px-4 py-2 border text-center" colSpan={3}>{(Number((internalAverage || 0) * 20 / 100) + Number((assignmentAverage || 0) * 10 / 100) + Number((endExamAverage || 0) * 70 / 100)).toFixed(2)}</td>
                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Weightage</td>
                  <td className="px-4 py-2 border text-center" colSpan={3}>80%</td>
                  <td className="px-4 py-2 border text-center" >20%</td>
                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Direct & Indirect attainment</td>
                  <td className="px-4 py-2 border text-center" colSpan={3}>{((Number((internalAverage || 0) * 20 / 100) + Number((assignmentAverage || 0) * 10 / 100) + Number((endExamAverage || 0) * 70 / 100)) * 80 / 100).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center" >{(endSurveyAvg * 20 / 100).toFixed(2)}</td>
                </tr>
                <tr className=" border">
                  <td className="px-4 py-2 border text-end" colSpan={7}>Overall Course attainment</td>
                  <td className="px-4 py-2 border text-center" colSpan={4}>{(((Number((internalAverage || 0) * 20 / 100) + Number((assignmentAverage || 0) * 10 / 100) + Number((endExamAverage || 0) * 70 / 100)) * 80 / 100) + (endSurveyAvg * 20 / 100)).toFixed(2)}</td>

                </tr>
              </tbody>
            </table>


            <table className=" border-collapse lg:mx-10">
              <thead className=" bg-amber-400">
                <tr>
                  <th className="px-4 py-2 border">Internal</th>
                  <th className="px-4 py-2 border">Assignment</th>
                  <th className="px-4 py-2 border">University</th>
                  <th className="px-4 py-2 border">Total attainment</th>
                  <th className="px-4 py-2 border">Direct 80 %</th>
                  <th className="px-4 py-2 border">Indirect 20 %</th>
                  <th className="px-4 py-2 border">Overall CO attainment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[0] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat1Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co1 || 0) * 0.7)) * 0.8) + (coValues[0] * 0.2)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[1] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat1Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co2 || 0) * 0.7)) * 0.8) + (coValues[1] * 0.2)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[2] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat2Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co3 || 0) * 0.7)) * 0.8) + (coValues[2] * 0.2)).toFixed(2)}</td>
                </tr>
               
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat1Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[3] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat2Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat2Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co4 || 0) * 0.7)) * 0.8) + (coValues[3] * 0.2)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[4] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat3Data?.attainment?.levels?.co1 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment1 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co5 || 0) * 0.7)) * 0.8) + (coValues[4] * 0.2)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)) * 0.8).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{(coValues[5] * 0.2).toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">{((((Number(iat3Data?.attainment?.levels?.co2 || 0) * 0.2) + (Number(iat3Data?.attainment?.levels?.assignment2 || 0) * 0.1) + (Number(endExamData?.attainment?.levels?.co6 || 0) * 0.7)) * 0.8) + (coValues[5] * 0.2)).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>



          </div>
          <div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default FASheet;


