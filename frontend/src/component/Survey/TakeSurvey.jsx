import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TakeSurvey = () => {

    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const url = "http://localhost:4000";
    const [allSubject, setAllSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const navigate = useNavigate();
    const [activeReportId, setActiveReportId] = useState(null);
    const [generatedLink, setGeneratedLink] = useState('');
    const [viewMode, setViewMode] = useState('available'); // 'available' or 'completed'
    const [reportsWithSurveys, setReportsWithSurveys] = useState([]);
    const [selectedCompletedReport, setSelectedCompletedReport] = useState(null);
    const [surveyResponses, setSurveyResponses] = useState([]);



    useEffect(() => {
        const getAllReports = async () => {
            try {
                const response = await axios.get(`${url}/reports/getAll`);
                setReports(response.data);
                setFilteredReports(response.data);

            } catch (error) {
                console.log("Fetching Error Report : ", error);;
            }
        }

        const getAllSubjects = async () => {
            try {
                const response = await axios.get(`${url}/subjects/getAll`);
                setAllSubjects(response.data)
            } catch (error) {
                console.log("Subject fetch error : ", error);
            }
        }
        getAllReports();
        getAllSubjects();
        getReportsWithSurveys();
    }, [])

    // Fetch reports that have survey responses
    const getReportsWithSurveys = async () => {
        try {
            const response = await axios.get(`${url}/Survey/reports-with-surveys`);
            setReportsWithSurveys(response.data);
        } catch (error) {
            console.log("Error fetching reports with surveys:", error);
        }
    }

    // Fetch survey responses for a specific report
    const fetchSurveyResponses = async (reportId) => {
        try {
            const response = await axios.get(`${url}/Survey/by-report/${reportId}`);
            setSurveyResponses(response.data);
            setSelectedCompletedReport(reportId);
        } catch (error) {
            console.log("Error fetching survey responses:", error);
            alert("Error loading survey responses");
        }
    }

    // Filter reports based on batch and department
    useEffect(() => {
        let filtered = reports;

        if (selectedBatch) {
            filtered = filtered.filter(report =>
                report.report_data?.batch?.toLowerCase() === selectedBatch.toLowerCase()
            );
        }

        if (selectedDepartment) {
            filtered = filtered.filter(report =>
                report.report_data?.department?.toLowerCase() === selectedDepartment.toLowerCase()
            );
        }

        if (selectedSubject) {
            filtered = filtered.filter(report => {
                const reportSubject = report.report_data?.subject?.trim().toLowerCase() || '';
                const filterSubject = selectedSubject.trim().toLowerCase();
                return reportSubject === filterSubject;
            });
        }



        setFilteredReports(filtered);
    }, [selectedBatch, selectedDepartment, reports, selectedSubject])

    // Get unique batches, departments, and subjects for filters
    const uniqueBatches = [...new Set(reports.map(report => report.report_data?.batch).filter(Boolean))];
    const uniqueDepartments = [...new Set(reports.map(report => report.report_data?.department).filter(Boolean))];
    const uniqueSubjects = [...new Set(reports.map(report => report.report_data?.subject).filter(Boolean))];

    const handleSearch = () => {
        // Filtering is handled by useEffect, this button can trigger a refresh if needed
        // For now, it's handled automatically by the useEffect above
    }

    // Format exam type display
    const getExamTypeDisplay = (reportType, internalType) => {
        if (reportType === 'internal') {
            return internalType ? `Internal (${internalType})` : 'Internal';
        } else if (reportType === 'endsem') {
            return 'End Exam';
        }
        return 'N/A';
    }

    const toggleExpand = (reportId) => {
        setExpandedIndex(expandedIndex === reportId ? null : reportId)
    }

    const handleGenerateSurveyLink = (reportId) => {
        const link = `${window.location.origin}/survey/${reportId}`;
        setGeneratedLink(link);
        setActiveReportId(reportId);   // Only this report button changes
    };

    // Delete a report
    const handleDeleteReport = async (reportId) => {
        const ok = window.confirm('Are you sure you want to delete this report? This action cannot be undone.');
        if (!ok) return;

        try {
            await axios.delete(`${url}/reports/delete/${reportId}`);

            // Remove from states
            setReports(prev => prev.filter(r => r._id !== reportId));
            setFilteredReports(prev => prev.filter(r => r._id !== reportId));
            setReportsWithSurveys(prev => prev.filter(id => id.toString() !== reportId.toString()));

            // If viewing responses for this report, clear view
            if (selectedCompletedReport && selectedCompletedReport.toString() === reportId.toString()) {
                setSelectedCompletedReport(null);
                setSurveyResponses([]);
            }

            // If active report (link), clear it
            if (activeReportId && activeReportId.toString() === reportId.toString()) {
                setActiveReportId(null);
                setGeneratedLink('');
            }

            alert('Report deleted successfully');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete report');
        }
    };



    return (
        <div className='bg-blue-100 pb-10 px-3 lg:px-15 pt-2'>
            <Navbar />

            <div className='my-10 bg-white px-5 lg:px-10 py-5 rounded shadow-lg'>
                <div className=' flex my-5'>

                    <img className='h-18 mx-auto' src={assets.college_logo} alt="" />

                </div>

                <div>
                    <h1 className=' text-xl lg:text-2xl font-bold '>Survey Management</h1>
                    <p className=' text-gray-600 '>Manage and view survey responses</p>
                </div>

                {/* View Mode Tabs */}
                <div className=' bg-blue-500 w-fit px-2 py-2 rounded-full shadow-xl mt-5  mb-10'>
                    <button
                        onClick={() => {
                            setViewMode('available');
                            setSelectedCompletedReport(null);
                            setSurveyResponses([]);
                        }}
                        className={` px-3 py-2 font-semibold transition-colors ${
                            viewMode === 'available'
                                ? 'bg-white rounded-full cursor-pointer'
                                : 'text-white'
                        }`}
                    >
                        Available Surveys
                    </button>
                    <button
                        onClick={() => {
                            setViewMode('completed');
                            setSelectedCompletedReport(null);
                            setSurveyResponses([]);
                            getReportsWithSurveys();
                        }}
                        className={`px-3 py-2 font-semibold transition-colors ${
                            viewMode === 'completed'
                                ? 'bg-white rounded-full cursor-pointer'
                                : 'text-white'
                        }`}
                    >
                        Completed Surveys
                    </button>
                </div>

                <div className='mt-5 flex flex-wrap gap-4 items-center'>
                    <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className=' py-2 border-2  px-5 rounded w-full lg:w-fit'
                    >
                        <option value="">Select the Batch</option>
                        {uniqueBatches.map((batch, index) => (
                            <option key={index} value={batch}>{batch}</option>
                        ))}
                    </select>

                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className='py-2 border-2  px-5 rounded w-full lg:w-fit'
                    >
                        <option value="">Select the Department</option>
                        {uniqueDepartments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className='py-2 border-2 px-5 rounded w-full lg:w-fit'
                    >
                        <option value="">Select the Subject</option>
                        {/* Show subjects from reports first (more accurate matching) */}
                        {uniqueSubjects.length > 0 ? (
                            uniqueSubjects.map((subject, index) => (
                                <option key={`report-${index}`} value={subject}>{subject}</option>
                            ))
                        ) : (
                            // Fallback to all subjects from API if no reports yet
                            allSubject.map((sub, index) => (
                                <option key={`api-${index}`} value={sub.subjectName}>{sub.subjectName}</option>
                            ))
                        )}
                    </select>

                    <button
                        onClick={handleSearch}
                        className=' bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition-colors'
                    >
                        Search
                    </button>

                    {(selectedBatch || selectedDepartment || selectedSubject) && (
                        <button
                            onClick={() => {
                                setSelectedBatch('');
                                setSelectedDepartment('');
                                setSelectedSubject('');
                            }}
                            className=' bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition-colors'
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Show Survey Responses if a completed survey is selected */}
                {viewMode === 'completed' && selectedCompletedReport && (
                    <div className='mt-10 bg-white border-2 border-blue-300 rounded-lg p-6'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-2xl font-bold text-gray-800'>Student Responses</h2>
                            <button
                                onClick={() => {
                                    setSelectedCompletedReport(null);
                                    setSurveyResponses([]);
                                }}
                                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
                            >
                                Back to List
                            </button>
                        </div>
                        {surveyResponses.length === 0 ? (
                            <div className='text-center py-10 text-gray-500'>
                                <p>No responses found for this survey.</p>
                            </div>
                        ) : (
                            <div className='space-y-4  '>
                                {surveyResponses.map((response, index) => (
                                <div key={response._id || index} className='border rounded-lg p-4 bg-gray-50 overflow-x-auto'>
                                    <div className='grid grid-cols-2 gap-4 mb-3 '>
                                        <div>
                                            <p><strong>Student Name:</strong> {response.studentData?.studentName || 'N/A'}</p>
                                            <p><strong>Roll Number:</strong> {response.studentData?.rollNumber || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p><strong>Submitted:</strong> {new Date(response.createdAt).toLocaleString()}</p>
                                            <p><strong>Exam Type:</strong> {response.examType === 'internal' ? 'Internal' : 'End Semester'}</p>
                                        </div>
                                    </div>
                                    <div className='border-t pt-3'>
                                        <p className='font-semibold mb-2'>Feedback:</p>
                                        <div className='grid grid-cols-2 gap-2'>
                                            {Object.entries(response.feedback || {}).map(([key, value]) => (
                                                <div key={key} className='flex items-center gap-2'>
                                                    <span className='font-medium capitalize'>{key}:</span>
                                                    <span className='bg-blue-100 px-2 py-1 rounded'>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {response.studentData?.comment && (
                                            <div className='mt-3 pt-3 border-t'>
                                                <p className='font-semibold mb-1'>Comment:</p>
                                                <p className='text-gray-700 italic'>{response.studentData.comment}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Show Reports List */}
                {!(viewMode === 'completed' && selectedCompletedReport) && (
                    <div className=' mt-10 overflow-x-auto'>
                        <div className=' grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr] bg-gradient-to-r from-cyan-600 to-blue-600 py-3 px-4 rounded text-white'>
                            <h1 className=' font-bold'>Batch</h1>
                            <h1 className=' font-bold'>Department</h1>
                            <h1 className=' font-bold'>Semester</h1>
                            <h1 className=' font-bold'>Subject</h1>
                            <h1 className=' font-bold'>Exam Type</h1>
                            <h1 className=' font-bold'>Status</h1>
                        </div>

                    {(() => {
                        // Filter reports based on view mode
                        let reportsToShow = filteredReports;
                        if (viewMode === 'completed') {
                            // Only show reports that have survey responses
                            reportsToShow = filteredReports.filter(report => 
                                reportsWithSurveys.some(id => id.toString() === report._id.toString())
                            );
                        } else {
                            // Only show reports that don't have survey responses
                            reportsToShow = filteredReports.filter(report => 
                                !reportsWithSurveys.some(id => id.toString() === report._id.toString())
                            );
                        }

                        if (reportsToShow.length === 0) {
                            return (
                                <div className='text-center py-10 text-gray-500'>
                                    <p>
                                        {viewMode === 'completed' 
                                            ? 'No completed surveys found.' 
                                            : 'No available surveys found.'}
                                        {(selectedBatch || selectedDepartment || selectedSubject) && ' Try adjusting your filters.'}
                                    </p>
                                </div>
                            );
                        }

                        return reportsToShow.map((report, index) => {
                            const isExpanded = expandedIndex === report._id;
                            const hasSurvey = reportsWithSurveys.some(id => id.toString() === report._id.toString());

                            return (
                                <div key={report._id || index}>
                                    <div className='grid grid-cols-[1fr_2fr_1.5fr_2fr_1fr_1fr_1.5fr] gap-3 bg-sky-50 py-2 px-4 my-1 rounded hover:bg-sky-100 transition-all items-center'>
                                        <h1 className='text-sm cursor-pointer' onClick={() => toggleExpand(report._id)}>{report.report_data?.batch || 'N/A'}</h1>
                                        <h1 className='text-sm cursor-pointer' onClick={() => toggleExpand(report._id)}>{report.report_data?.department || 'N/A'}</h1>
                                        <h1 className='text-sm cursor-pointer' onClick={() => toggleExpand(report._id)}>{report.report_data?.semester || 'N/A'}</h1>
                                        <h1 className='text-sm truncate cursor-pointer' onClick={() => toggleExpand(report._id)}>{report.report_data?.subject || 'Untitled Report'}</h1>
                                        <h1 className='font-semibold text-sm cursor-pointer' onClick={() => toggleExpand(report._id)}>
                                            {getExamTypeDisplay(report.report_type, report.report_data?.internalType)}
                                        </h1>
                                        <h1 className={`font-semibold text-sm cursor-pointer ${hasSurvey ? 'text-green-600' : 'text-gray-500'}`} onClick={() => toggleExpand(report._id)}>
                                            {hasSurvey ? 'Completed' : 'Available'}
                                        </h1>
                                        <div className='flex gap-2 justify-start'>
                                            {viewMode === 'available' ? (
                                                <>
                                                    {activeReportId === report._id ? (
                                                        <button
                                                            className="bg-blue-600 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-blue-700 whitespace-nowrap"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigator.clipboard.writeText(generatedLink);
                                                                alert("Survey link copied!");
                                                            }}
                                                        >
                                                            Copy Link
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="bg-green-600 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-green-700 whitespace-nowrap"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleGenerateSurveyLink(report._id);
                                                            }}
                                                        >
                                                            Take Survey
                                                        </button>
                                                    )}
                                                    <button
                                                        className="bg-yellow-500 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-yellow-600 whitespace-nowrap"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteReport(report._id); }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        className="bg-gray-600 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-gray-700 whitespace-nowrap"
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(report._id); }}
                                                    >
                                                        {isExpanded ? 'Hide' : 'Info'}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="bg-blue-600 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-blue-700 whitespace-nowrap"
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/survey-responses/${report._id}`); }}
                                                    >
                                                        View Responses
                                                    </button>
                                                    <button
                                                        className="bg-yellow-500 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-yellow-600 whitespace-nowrap"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteReport(report._id); }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        className="bg-gray-600 py-1 px-2 rounded text-white text-xs cursor-pointer z-20 hover:bg-gray-700 whitespace-nowrap"
                                                        onClick={(e) => { e.stopPropagation(); toggleExpand(report._id); }}
                                                    >
                                                        {isExpanded ? 'Hide' : 'Info'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className='ml-4 mt-2 mb-3 border-l-4 border-blue-400 bg-blue-50 px-6 py-4 text-gray-700 rounded-lg'>
                                            <div className="grid grid-cols-2 gap-6">
                                                {/* Report Details - Left Column */}
                                                <div>
                                                    <p className="mb-3"><strong className="text-lg">Report Details</strong></p>
                                                    <div className="space-y-2">
                                                        <p><strong>Exam Type:</strong> {report.report_type === 'internal' ? 'Internal Exam' : 'End Semester Exam'}</p>
                                                        <p><strong>Total Students:</strong> {report.report_data?.totalStudents || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                {/* CO Values - Right Column */}
                                                <div>
                                                    <p className="mb-3"><strong className="text-lg">CO Values</strong></p>
                                                    {report.report_type === 'endsem' ? (
                                                        // End Exam: Show all CO1-CO6 values
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'].map(key => {
                                                                const value = report.report_data?.coValues?.[key];
                                                                return (
                                                                    <p key={key}>
                                                                        <strong>{key}:</strong> {value !== undefined && value !== null && value !== '' ? value : 'N/A'}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        // Internal: Show CO values and Assignment values
                                                        <div className="space-y-2">
                                                            {report.report_data?.coValues && Object.keys(report.report_data.coValues)
                                                                .filter(key => key.startsWith('CO'))
                                                                .sort()
                                                                .map(key => {
                                                                    const value = report.report_data.coValues[key];
                                                                    return (
                                                                        <p key={key}>
                                                                            <strong>{key}:</strong> {value !== undefined && value !== null && value !== '' ? value : 'N/A'}
                                                                        </p>
                                                                    );
                                                                })
                                                            }
                                                            {report.report_data?.coValues && (
                                                                (report.report_data.coValues.Assignment1 !== undefined ||
                                                                    report.report_data.coValues.Assignment2 !== undefined) && (
                                                                    <div className="mt-3 pt-3 border-t">
                                                                        <p className="mb-2"><strong>Assignments:</strong></p>
                                                                        <div className="space-y-1">
                                                                            {report.report_data.coValues.Assignment1 !== undefined && (
                                                                                <p>
                                                                                    <strong>Assignment 1:</strong> {
                                                                                        report.report_data.coValues.Assignment1 !== null &&
                                                                                            report.report_data.coValues.Assignment1 !== ''
                                                                                            ? report.report_data.coValues.Assignment1
                                                                                            : 'N/A'
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                            {report.report_data.coValues.Assignment2 !== undefined && (
                                                                                <p>
                                                                                    <strong>Assignment 2:</strong> {
                                                                                        report.report_data.coValues.Assignment2 !== null &&
                                                                                            report.report_data.coValues.Assignment2 !== ''
                                                                                            ? report.report_data.coValues.Assignment2
                                                                                            : 'N/A'
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 border-t pt-4">
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/report/${report._id}`;
                                                    }}
                                                >
                                                    View Full Report
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        });
                    })()}
                    </div>
                )}


            </div>
        </div>
    )
}

export default TakeSurvey