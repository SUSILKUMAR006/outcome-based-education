import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { assets } from '../assets/assets'
import axios from 'axios'


const Report = () => {

    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const url = "http://localhost:4000";
    const [allSubject, setAllSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');

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

        const getAllSubjects =  async () =>{
            try {
                const response  =  await axios.get(`${url}/subjects/getAll`);
                setAllSubjects(response.data)
            } catch (error) {
                console.log("Subject fetch error : " , error); 
            }
        }
        getAllReports();
        getAllSubjects();
    }, [])

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
    }, [selectedBatch, selectedDepartment, reports , selectedSubject])

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

    const handleDelete = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                await axios.delete(`${url}/reports/delete/${reportId}`);
                // Remove the report from the list
                setReports(reports.filter(report => report._id !== reportId));
                setFilteredReports(filteredReports.filter(report => report._id !== reportId));
                alert('Report deleted successfully');
            } catch (error) {
                console.error("Delete error:", error);
                alert('Error deleting report');
            }
        }
    }

    return (
        <div className='bg-blue-100 pb-10 px-3 lg:px-15 pt-2'>
            <Navbar />

            <div className='my-10 bg-white px-10 py-5 rounded shadow-lg'>
                <div className=' flex mb-5 lg:my-5'>

                    <img className=' mx-auto' src={assets.college_logo} alt="" />

                </div>

                <div>
                    <h1 className=' text-xl lg:text-3xl font-bold '>All Exam's Results</h1>
                    <p className=' text-gray-600 '>Find the all Exam report in bacth wise</p>
                </div>

                <div className='mt-5 flex flex-wrap gap-4 items-center'>
                    <select 
                        value={selectedBatch} 
                        onChange={(e) => setSelectedBatch(e.target.value)} 
                        className=' w-full lg:w-fit py-2 border-2  px-5 rounded'
                    >
                        <option value="">Select the Batch</option>
                        {uniqueBatches.map((batch, index) => (
                            <option key={index} value={batch}>{batch}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedDepartment} 
                        onChange={(e) => setSelectedDepartment(e.target.value)} 
                        className=' w-full lg:w-fit py-2 border-2  px-5 rounded'
                    >
                        <option value="">Select the Department</option>
                        {uniqueDepartments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedSubject} 
                        onChange={(e) => setSelectedSubject(e.target.value)} 
                        className=' w-full lg:w-fit py-2 border-2 px-5 rounded'
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

                <div className=' mt-10 overflow-x-auto'>
                    <div className=' grid w-4xl lg:w-full  grid-cols-[1fr_2fr_1.5fr_2fr_2.5fr] bg-gradient-to-r from-cyan-600 to-blue-600 py-3 px-4 rounded text-white '>
                        <h1 className=' font-bold'>Batch</h1>
                        <h1 className=' font-bold'>Department</h1>
                        <h1 className=' font-bold'>Semester</h1>
                        <h1 className=' font-bold'>Subject</h1>
                        <h1 className=' font-bold'>Exam Type</h1>
                    </div>

                    {filteredReports.length === 0 ? (
                        <div className='text-center  py-10 text-gray-500'>
                            <p>No reports found. {(selectedBatch || selectedDepartment || selectedSubject) ? 'Try adjusting your filters.' : 'No reports available.'}</p>
                        </div>
                    ) : (
                        filteredReports.map((report, index) => {
                            const isExpanded = expandedIndex === report._id;
                            
                            return (
                                <div key={report._id || index}>
                                    <div
                                        onClick={() => toggleExpand(report._id)}
                                        className=' w-4xl lg:w-full grid grid-cols-[1fr_2fr_1.5fr_2fr_2.5fr] bg-sky-100 py-2 px-4 my-2 rounded cursor-pointer hover:bg-sky-200 scale-99 hover:scale-100 transition-all duration-200'
                                    >
                                        <h1>{report.report_data?.batch || 'N/A'}</h1>
                                        <h1>{report.report_data?.department || 'N/A'}</h1>
                                        <h1>{report.report_data?.semester || 'N/A'}</h1>
                                        <h1>{report.report_data?.subject || 'Untitled Report'}</h1>
                                        <h1 className='font-semibold'>
                                            {getExamTypeDisplay(report.report_type, report.report_data?.internalType)}
                                        </h1>
                            </div>

                                    {isExpanded && (
                                        <div className="border-l-4 w-4xl lg:w-full border-sky-400 bg-blue-50 px-6 py-4 text-gray-700 rounded-lg shadow-inner mb-2">
                                            <div className="grid  grid-cols-2 gap-6">
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

                                            <div className="mt-4 border-t pt-4 flex gap-3">
                                                <button
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/report/${report._id}`;
                                                    }}
                                                >
                                                    View Full Report
                                                </button>
                                                <button
                                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(report._id);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                        </div>
                            );
                        })
                    )}
                </div>


            </div>
        </div>
    )
}

export default Report