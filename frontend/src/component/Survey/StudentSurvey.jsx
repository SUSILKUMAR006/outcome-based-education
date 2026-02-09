import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets';

const StudentSurvey = () => {

    const { reportId } = useParams();
    const url = "http://localhost:4000";

    const [report, setReport] = useState(null);
    const [studentData, setStudentData] = useState({
        rollNumber: '',
        studentName: '',
        comment: ''
    });
    const [feedback, setFeedback] = useState({});

    // Helper function to extract fields from coValues
    const extractFieldsFromCoValues = (coValues) => {
        if (!coValues) {
            return { cos: [], assignments: [] };
        }

        const cos = [];
        const assignments = [];

        Object.keys(coValues).forEach(key => {
            if (key.startsWith('CO') && coValues[key] !== undefined && coValues[key] !== null && coValues[key] !== '') {
                cos.push(key);
            } else if ((key === 'Assignment1' || key === 'Assignment2') && coValues[key] !== undefined && coValues[key] !== null && coValues[key] !== '') {
                assignments.push(key);
            }
        });

        // Sort COs numerically (CO1, CO2, CO3, etc.)
        cos.sort((a, b) => {
            const numA = parseInt(a.replace('CO', ''));
            const numB = parseInt(b.replace('CO', ''));
            return numA - numB;
        });

        // Sort Assignments (Assignment1, Assignment2)
        assignments.sort();

        return { cos, assignments };
    };

    // Extract available COs and Assignments from report data
    const getAvailableFields = () => {
        if (!report || !report.report_data?.coValues) {
            return { cos: [], assignments: [] };
        }
        return extractFieldsFromCoValues(report.report_data.coValues);
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${url}/report/get/${reportId}`);
                setReport(response.data);
                
                // Initialize feedback state with available fields
                if (response.data?.report_data?.coValues) {
                    const { cos, assignments } = extractFieldsFromCoValues(response.data.report_data.coValues);
                    const initialFeedback = {};
                    cos.forEach(co => {
                        initialFeedback[co.toLowerCase()] = '';
                    });
                    assignments.forEach(assignment => {
                        initialFeedback[assignment.toLowerCase()] = '';
                    });
                    setFeedback(initialFeedback);
                }
            } catch (error) {
                console.log("Survey fetch data :", error);
            }
        }

        fetchReport();
    }, [reportId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeedbackChange = (field, value) => {
        setFeedback(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that all required feedback fields are filled
        const { cos, assignments } = getAvailableFields();
        const allFieldsFilled = [...cos, ...assignments].every(field => {
            const fieldKey = field.toLowerCase();
            return feedback[fieldKey] && feedback[fieldKey] !== '';
        });

        if (!allFieldsFilled) {
            alert('Please fill all feedback fields before submitting.');
            return;
        }
        
        // Prepare survey data
        const surveyData = {
            reportId: reportId,
            studentData: studentData,
            feedback: feedback,
            examType: report.report_type,
            submittedAt: new Date().toISOString()
        };

        console.log('Survey Data to Submit:', surveyData);
        
        try {
            const response = await axios.post(`${url}/Survey/submit-survey`, surveyData);
            console.log('Survey submitted successfully:', response.data);
            alert('Survey submitted successfully!');
            
            // Reset form after successful submission
            setStudentData({
                rollNumber: '',
                studentName: '',
                comment: ''
            });
            const initialFeedback = {};
            cos.forEach(co => {
                initialFeedback[co.toLowerCase()] = '';
            });
            assignments.forEach(assignment => {
                initialFeedback[assignment.toLowerCase()] = '';
            });
            setFeedback(initialFeedback);
        } catch (error) {
            console.error('Error submitting survey:', error);
            alert('Failed to submit survey. Please try again.');
        }
    };

    if (!report) {
        return <h2 className=' text-center mt-10'>Loading...</h2>
    }

    const { cos, assignments } = getAvailableFields();
    const examTypeDisplay = report.report_type === "endsem" ? "End Semester Exam" : `Internal Exam${report.report_data?.internalType ? ` (${report.report_data.internalType})` : ''}`;

    return (
        <div className=' bg-gray-700  px-5 py-10 flex text-sm' >
            <div className=' bg-white mx-auto py-5 lg:py-10 px-5 lg:px-10 rounded-lg max-w-4xl w-full'>
                <div className='flex justify-center'>
                    <img src={assets.college_logo} alt="College Logo" />
                </div>
                <div className=' mt-6'>
                    <h1 className=' text-center text-xl font-semibold'>OBE - Survey System</h1>
                    <p className=' text-center text-sm text-gray-700'>Please give your feedback on the course outcomes (CO)</p>
                </div>

                <form className=' mt-5' onSubmit={handleSubmit}>
                    {/* Report Information */}
                    <div className='mb-6 space-y-2'>
                        <h2 className=' font-semibold'>Student Batch : <span className='text-gray-700 font-normal'>{report.report_data?.batch || 'N/A'}</span></h2>
                        <h2 className=' font-semibold'>Subject Name : <span className='text-gray-700 font-normal'>{report.report_data?.subject || 'N/A'}</span></h2>
                        <h2 className=' font-semibold'>Department Name : <span className='text-gray-700 font-normal'>{report.report_data?.department || 'N/A'}</span></h2>
                        <h2 className=' font-semibold'>Semester : <span className='text-gray-700 font-normal'>{report.report_data?.semester || 'N/A'}</span></h2>
                        <h2 className=' font-semibold'>Exam Type : <span className='text-gray-700 font-normal'>{examTypeDisplay}</span></h2>
                    </div>

                    {/* CO Marks Display - Dynamic */}
                    {cos.length > 0 && (
                        <div className=' flex flex-wrap gap-3 my-6 justify-center items-center p-4 bg-gray-50 rounded'>
                            <h2 className=' text-center font-semibold w-full mb-2'>CO Marks : </h2>
                            {cos.map(co => (
                                <p key={co} className='flex items-center gap-1'>
                                    {co} : <span className=' bg-amber-500 p-1 shadow rounded font-semibold'>{report.report_data.coValues[co]}</span>
                                </p>
                            ))}
                            {assignments.length > 0 && assignments.map(assignment => (
                                <p key={assignment} className='flex items-center gap-1'>
                                    {assignment === 'Assignment1' ? 'A1' : 'A2'} : <span className=' bg-amber-500 p-1 shadow rounded font-semibold'>{report.report_data.coValues[assignment]}</span>
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Student Information */}
                    <div className=' mt-5 flex items-center gap-5'>
                        <label className=' w-[30%]' htmlFor="rollNumber">Roll Number : </label>
                        <input
                            className=' border w-[70%] rounded py-1 px-2'
                            type="text"
                            id="rollNumber"
                            name="rollNumber"
                            placeholder='ex: 7140xxxxxxxxxx'
                            value={studentData.rollNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className=' mt-5 flex items-center gap-5'>
                        <label className=' w-[30%]' htmlFor="studentName">Student Name : </label>
                        <input
                            className=' border w-[70%] rounded py-1 px-2'
                            type="text"
                            id="studentName"
                            name="studentName"
                            placeholder='Enter Name'
                            value={studentData.studentName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Dynamic CO Feedback Fields */}
                    {cos.map(co => (
                        <div key={co} className=' mt-5 flex items-center gap-5'>
                            <label className=' w-[30%]' htmlFor={co.toLowerCase()}>
                                {co} : 
                            </label>
                            <select
                                className='border w-[70%] rounded py-1 px-2'
                                id={co.toLowerCase()}
                                name={co.toLowerCase()}
                                value={feedback[co.toLowerCase()] || ''}
                                onChange={(e) => handleFeedbackChange(co.toLowerCase(), e.target.value)}
                                required
                            >
                                <option value="">Select the review</option>
                                <option value="1">1 - Not bad</option>
                                <option value="2">2 - Good</option>
                                <option value="3">3 - Very Good</option>
                            </select>
                        </div>
                    ))}

                    {/* Dynamic Assignment Feedback Fields */}
                    {assignments.map(assignment => (
                        <div key={assignment} className=' mt-5 flex items-center gap-5'>
                            <label className=' w-[30%]' htmlFor={assignment.toLowerCase()}>
                                {assignment === 'Assignment1' ? 'Assignment 1' : 'Assignment 2'} : 
                            </label>
                            <select
                                className='border w-[70%] rounded py-1 px-2'
                                id={assignment.toLowerCase()}
                                name={assignment.toLowerCase()}
                                value={feedback[assignment.toLowerCase()] || ''}
                                onChange={(e) => handleFeedbackChange(assignment.toLowerCase(), e.target.value)}
                                required
                            >
                                <option value="">Select the review</option>
                                <option value="1">1 - Not bad</option>
                                <option value="2">2 - Good</option>
                                <option value="3">3 - Very Good</option>
                            </select>
                        </div>
                    ))}

                    {/* Comment Field */}
                    <div className='mt-5 flex items-center gap-5'>
                        <label className=' w-[30%]' htmlFor="comment">Comment (Optional) :</label>
                        <textarea
                            className='border w-[70%] rounded py-1 px-2 text-gray-700'
                            id="comment"
                            name="comment"
                            rows="3"
                            placeholder='Write something for improvement'
                            value={studentData.comment}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className=' flex mt-10'>
                        <button
                            className=' bg-green-700 py-2 px-10 mt-5 text-white rounded mx-auto hover:bg-green-800 transition-colors'
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StudentSurvey