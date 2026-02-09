import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Navbar from "../Navbar";

const ViewSurvey = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [report, setReport] = useState(null);
    const url = "http://localhost:4000";

    // Helper to extract dynamic COs and Assignments (same logic as StudentSurvey)
    const extractFieldsFromCoValues = (coValues) => {
        if (!coValues) return { cos: [], assignments: [] };

        const cos = [];
        const assignments = [];

        Object.keys(coValues).forEach((key) => {
            if (key.startsWith("CO") && coValues[key] !== undefined && coValues[key] !== null && coValues[key] !== "") {
                cos.push(key);
            } else if ((key === "Assignment1" || key === "Assignment2") && coValues[key] !== undefined && coValues[key] !== null && coValues[key] !== "") {
                assignments.push(key);
            }
        });

        cos.sort((a, b) => {
            const numA = parseInt(a.replace("CO", ""));
            const numB = parseInt(b.replace("CO", ""));
            return numA - numB;
        });

        assignments.sort();

        return { cos, assignments };
    };

    const getAvailableFields = () => {
        if (!report || !report.report_data?.coValues) {
            return { cos: [], assignments: [] };
        }
        return extractFieldsFromCoValues(report.report_data.coValues);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get report details (for examType, subject, CO marks etc.)
                const reportRes = await axios.get(`${url}/report/get/${reportId}`);
                setReport(reportRes.data);

                // Get all survey responses for this report
                const res = await axios.get(`${url}/Survey/by-report/${reportId}`);
                setResponses(res.data);
            } catch (err) {
                console.error(err);
                alert("Failed to load survey details");
            }
        };

        fetchData();
    }, [reportId]);

    const { cos, assignments } = getAvailableFields();
    const examTypeDisplay = report
        ? report.report_type === "endsem"
            ? "End Semester Exam"
            : `Internal Exam${report.report_data?.internalType ? ` (${report.report_data.internalType})` : ""}`
        : "";

    // Filter responses by current exam type (if examType is stored in response)
    const filteredResponses = report
        ? responses.filter(
            (r) => !r.examType || r.examType === report.report_type
        )
        : responses;

    // Compute average feedback for each CO and Assignment based on filteredResponses
    const coAverages = {};
    const assignmentAverages = {};

    if (filteredResponses.length > 0) {
        cos.forEach((co) => {
            const key = co.toLowerCase();
            let sum = 0;
            let count = 0;
            filteredResponses.forEach((res) => {
                const value = Number(res.feedback?.[key]);
                if (!isNaN(value)) {
                    sum += value;
                    count += 1;
                }
            });
            coAverages[key] = count > 0 ? (sum / count).toFixed(2) : "-";
        });

        assignments.forEach((assignment) => {
            const key = assignment.toLowerCase();
            let sum = 0;
            let count = 0;
            filteredResponses.forEach((res) => {
                const value = Number(res.feedback?.[key]);
                if (!isNaN(value)) {
                    sum += value;
                    count += 1;
                }
            });
            assignmentAverages[key] = count > 0 ? (sum / count).toFixed(2) : "-";
        });
    }

    // Save survey feedback to report
    const handleSaveSurveyFeedback = async () => {
        if (!report || filteredResponses.length === 0) {
            alert("No survey responses to save");
            return;
        }

        try {
            // Prepare survey feedback data
            const surveyFeedback = {
                coAverages: coAverages,
                assignmentAverages: assignmentAverages,
                totalResponses: filteredResponses.length,
                savedAt: new Date().toISOString()
            };

            // Update report with survey feedback
            const updatedReportData = {
                ...report.report_data,
                surveyFeedback: surveyFeedback
            };

            const response = await axios.put(`${url}/report/update/${reportId}`, {
                report_data: updatedReportData
            });

            if (response.data) {
                alert("✅ Survey feedback saved successfully to report!");
                // Refresh the report data
                const reportRes = await axios.get(`${url}/report/get/${reportId}`);
                setReport(reportRes.data);
            }
        } catch (error) {
            console.error("Error saving survey feedback:", error);
            alert("❌ Error saving survey feedback. Please try again.");
        }
    };

    return (
        <div className="bg-blue-100 pb-10 px-3 lg:px-15 pt-2 ">
            {/* Back Button */}
            <Navbar />
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded my-4"
            >
                ← Back
            </button>

      
            

            <div className="flex justify-center bg-white rounded-t">
                <img src={assets.college_logo} alt="College Logo" className="h-18 lg:h-22 px-5 py-3" />

            </div>


            {/* Report Information in a full-width panel */}
            {report && (
                <div className=" p-4 bg-white rounded shadow grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm lg:text-md">
                    <p>
                        <span className="font-semibold">Student Batch :</span>{" "}
                        <span className="text-gray-700">
                            {report.report_data?.batch || "N/A"}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Subject Name :</span>{" "}
                        <span className="text-gray-700">
                            {report.report_data?.subject || "N/A"}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Department Name :</span>{" "}
                        <span className="text-gray-700">
                            {report.report_data?.department || "N/A"}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Semester :</span>{" "}
                        <span className="text-gray-700">
                            {report.report_data?.semester || "N/A"}
                        </span>
                    </p>
                    <p>
                        <span className="font-semibold">Exam Type :</span>{" "}
                        <span className="text-gray-700">
                            {examTypeDisplay || "N/A"}
                        </span>
                    </p>
                </div>
            )}

            {/* CO Marks Display - horizontal full-width strip */}
            {report && cos.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded shadow">
                    <h2 className="font-semibold mr-4">CO Marks :</h2>
                    {cos.map((co) => (
                        <p key={co} className="flex items-center gap-1">
                            {co} :{" "}
                            <span className="bg-amber-500 p-1 shadow rounded font-semibold">
                                {report.report_data.coValues[co]}
                            </span>
                        </p>
                    ))}
                    {assignments.length > 0 &&
                        assignments.map((assignment) => (
                            <p key={assignment} className="flex items-center gap-1">
                                {assignment === "Assignment1" ? "A1" : "A2"} :{" "}
                                <span className="bg-amber-500 p-1 shadow rounded font-semibold">
                                    {report.report_data.coValues[assignment]}
                                </span>
                            </p>
                        ))}
                </div>
            )}

            {/* Responses Table - uses full page width */}
            <h2 className="text-lg font-semibold mt-4 mb-3">Student Responses</h2>

            {filteredResponses.length === 0 ? (
                <p>No responses available</p>
            ) : (
                <div className="overflow-x-auto bg-white p-3 rounded shadow">
                    <table className="w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-green-300 text-center">
                                <th className="border p-2">S.No</th>
                                <th className="border p-2">Roll No</th>
                                <th className="border p-2">Student Name</th>
                                {cos.length > 0 && (
                                    <th
                                        className="border p-2"
                                        colSpan={cos.length}
                                    >
                                        CO Feedback ({examTypeDisplay || "Exam"})
                                    </th>
                                )}
                                {assignments.length > 0 && (
                                    <th
                                        className="border p-2"
                                        colSpan={assignments.length}
                                    >
                                        Assignment Feedback
                                    </th>
                                )}
                            </tr>
                            <tr className="bg-yellow-200 text-center">
                                {/* Empty headers for S.No, Roll, Name */}
                                <th className="border p-2"></th>
                                <th className="border p-2"></th>
                                <th className="border p-2"></th>
                                {cos.map((co) => (
                                    <th key={co} className="border p-2">
                                        {co}
                                    </th>
                                ))}
                                {assignments.map((assignment) => (
                                    <th key={assignment} className="border p-2">
                                        {assignment === "Assignment1" ? "A1" : "A2"}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {filteredResponses.map((res, index) => (
                                <tr key={res._id}>
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="border p-2">
                                        {res.studentData?.rollNumber}
                                    </td>
                                    <td className="border p-2">
                                        {res.studentData?.studentName}
                                    </td>
                                    {cos.map((co) => {
                                        const key = co.toLowerCase();
                                        return (
                                            <td key={key} className="border p-2">
                                                {res.feedback?.[key] || "-"}
                                            </td>
                                        );
                                    })}
                                    {assignments.map((assignment) => {
                                        const key = assignment.toLowerCase();
                                        return (
                                            <td key={key} className="border p-2">
                                                {res.feedback?.[key] || "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}

                            {/* Average row for all COs and Assignments based on exam type */}
                            {(cos.length > 0 || assignments.length > 0) && (
                                <tr className="bg-gray-100 font-semibold">
                                    {/* Span the first three columns (S.No, Roll, Name) */}
                                    <td
                                        className="border p-2 text-right pr-4"
                                        colSpan={3}
                                    >
                                        Average ({examTypeDisplay || "Exam"})
                                    </td>
                                    {cos.map((co) => {
                                        const key = co.toLowerCase();
                                        return (
                                            <td key={key} className="border p-2">
                                                {coAverages[key] ?? "-"}
                                            </td>
                                        );
                                    })}
                                    {assignments.map((assignment) => {
                                        const key = assignment.toLowerCase();
                                        return (
                                            <td key={key} className="border p-2">
                                                {assignmentAverages[key] ?? "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                        </tbody>
                    </table>

                    
                </div>
                
            )}
            <div className="flex justify-between items-center mt-4">
                <div></div>
                <button
                    onClick={handleSaveSurveyFeedback}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors font-semibold"
                >
                    💾 Save Survey Feedback to Report
                </button>
            </div>
        </div>
    );
};

export default ViewSurvey;
