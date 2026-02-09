import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets';
import axios from 'axios'
import * as XLSX from 'xlsx';

const AddStudent = () => {
    const [activeTab, setActiveTab] = useState("Add");
    const [name, setName] = useState('')
    const [rollNumber, setRollNumber] = useState('')
    const [department, setDepartment] = useState('')
    const [departments, setDepartments] = useState([])
    const [deptLoading, setDeptLoading] = useState(false)
    const [deptError, setDeptError] = useState(null)
    const [batch, setBatch] = useState('')
    const [students, setStudents] = useState([])
    const [studentsLoading, setStudentsLoading] = useState(false)
    const [studentsError, setStudentsError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Excel Upload State
    const [excelData, setExcelData] = useState([]);
    const [excelFile, setExcelFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Bulk Upload State
    const [bulkDepartment, setBulkDepartment] = useState('');
    const [bulkBatch, setBulkBatch] = useState('');

    const url = 'http://localhost:4000';

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { name, rollNumber, department, batch }
            const res = await axios.post(`${url}/students/add`, payload)
            if (res.status === 201) {
                alert('Student added')
                setName('')
                setRollNumber('')
            }
        } catch (err) {
            console.error('Add student error', err)
            alert('Failed to add student')
        }
    }

    const handleExcelFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setExcelFile(file);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            setExcelData(data);
            console.log("Parsed Excel Data:", data);
        };
        reader.readAsBinaryString(file);
    };

    const handleBulkAdd = async () => {
        if (!bulkDepartment || !bulkBatch) {
            alert("Please select Department and enter Batch for the bulk upload.");
            return;
        }
        if (excelData.length === 0) {
            alert("No data found in Excel file.");
            return;
        }

        if (!window.confirm(`Are you sure you want to add ${excelData.length} students to ${bulkDepartment} - ${bulkBatch}?`)) {
            return;
        }

        setUploading(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // Iterate and add one by one
            for (const row of excelData) {
                // Adjust keys based on expected Excel headers (case insensitive matching)
                const keys = Object.keys(row);
                const nameKey = keys.find(k => k.toLowerCase().includes('name'));
                const rollKey = keys.find(k => k.toLowerCase().includes('roll') || k.toLowerCase().includes('number') || k.toLowerCase().includes('usn') || k.toLowerCase().includes('reg'));

                const studentName = row[nameKey];
                const studentRoll = row[rollKey];

                if (studentName && studentRoll) {
                    try {
                        const payload = {
                            name: String(studentName).trim(),
                            rollNumber: String(studentRoll).trim(),
                            department: bulkDepartment,
                            batch: bulkBatch
                        };
                        await axios.post(`${url}/students/add`, payload);
                        successCount++;
                    } catch (err) {
                        console.error(`Failed to add ${studentName}`, err);
                        failCount++;
                    }
                } else {
                    console.warn("Skipping invalid row:", row);
                    failCount++;
                }
            }
            alert(`Bulk Upload Complete.\nSuccessfully Added: ${successCount}\nFailed: ${failCount}`);
            setExcelFile(null);
            setExcelData([]);
            setBulkDepartment('');
            setBulkBatch('');
            document.getElementById('excelUpload').value = ""; // Reset file input

            // Refresh students list
            const res = await axios.get(`${url}/students/getAll`);
            setStudents(res.data || []);

        } catch (error) {
            console.error("Bulk upload error:", error);
            alert("An error occurred during bulk upload.");
        } finally {
            setUploading(false);
        }
    };

    // fetch departments on mount
    useEffect(() => {
        const fetchDepts = async () => {
            setDeptLoading(true)
            try {
                const res = await axios.get(`${url}/departments/getAll`)
                setDepartments(res.data || [])
            } catch (err) {
                console.error('Failed to fetch departments', err)
                setDeptError('Failed to load departments')
            } finally {
                setDeptLoading(false)
            }
        }
        fetchDepts()
    }, [])

    // fetch students on mount
    useEffect(() => {
        const fetchStudents = async () => {
            setStudentsLoading(true)
            try {
                const res = await axios.get(`${url}/students/getAll`)
                setStudents(res.data || [])
            } catch (err) {
                console.error('Failed to fetch students', err)
                setStudentsError('Failed to load students')
            } finally {
                setStudentsLoading(false)
            }
        }
        fetchStudents()
    }, [])

    return (
        <div className='bg-blue-200  pb-10 px-3 lg:px-15 pt-2'>
            <Navbar />
            <div className=' bg-white py-5 px-5 lg:px-10 mt-5' >
                <h1 className='font-semibold '>Student information</h1>
                <div className=' text-sm md:text-md flex  gap-5 mt-5 bg-blue-400 w-fit py-1 px-1 rounded-full text-white'>
                    <h1 className={activeTab === 'All' ? " cursor-pointer bg-white rounded-full px-4 py-2 text-black transition-all duration-300" : "px-4 py-2 transition-all duration-300"} onClick={() => setActiveTab("All")} >All Students</h1>
                    <h1 className={activeTab === 'Add' ? " cursor-pointer bg-white rounded-full px-4 py-2 text-black transition-all duration-300" : "px-4 py-2 transition-all duration-300"} onClick={() => setActiveTab("Add")} >Add Students</h1>
                </div>
                <div className=' flex justify-center mt-10'>
                    <img src={assets.college_logo} className='  object-contain' alt="" srcSet="" />
                </div>
                {activeTab === 'All' && (
                    <div className=' mt-8 w-full px-4 lg:px-12'>
                        <h2 className=' text-center font-bold text-2xl mb-8 text-gray-800'>All Students</h2>
                        <div className=' w-full flex justify-center mb-8'>
                            <input
                                type='text'
                                placeholder='Search by name, department, or batch...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className=' w-full lg:w-[60%] border-2 border-blue-300 p-3 rounded-lg outline-0 focus:border-blue-500 transition'
                            />
                        </div>

                        {studentsLoading ? (
                            <div className=' text-center py-10 text-lg text-gray-600'>Loading students...</div>
                        ) : studentsError ? (
                            <div className=' text-red-600 text-center py-10 text-lg'>{studentsError}</div>
                        ) : (
                            <div className=' overflow-x-auto'>
                                <table className=' w-full border-collapse bg-white'>
                                    <thead>
                                        <tr className=' bg-blue-200 border-2 border-blue-300'>
                                            <th className=' px-6 py-4 text-left font-bold text-gray-800 border-r border-blue-300'>Name</th>
                                            <th className=' px-6 py-4 text-left font-bold text-gray-800 border-r border-blue-300'>Roll Number</th>
                                            <th className=' px-6 py-4 text-left font-bold text-gray-800 border-r border-blue-300'>Department</th>
                                            <th className=' px-6 py-4 text-left font-bold text-gray-800'>Batch</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.filter(s => {
                                            const search = searchTerm.toLowerCase()
                                            return (
                                                s.name.toLowerCase().includes(search) ||
                                                s.department.toLowerCase().includes(search) ||
                                                s.batch.toLowerCase().includes(search)
                                            )
                                        }).map((s, idx) => (
                                            <tr key={s._id || s.rollNumber} className={` border-b-2 border-blue-200 ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'} hover:bg-blue-100 transition`}>
                                                <td className=' px-6 py-4 text-gray-800 border-r border-blue-200'>{s.name}</td>
                                                <td className=' px-6 py-4 text-gray-800 border-r border-blue-200'>{s.rollNumber}</td>
                                                <td className=' px-6 py-4 text-gray-800 border-r border-blue-200'>{s.department}</td>
                                                <td className=' px-6 py-4 text-gray-800'>{s.batch}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}


                {activeTab === "Add" && (
                    <div className=' mt-5 flex flex-col items-center'>
                        <h1 className=' text-center'>Add Students</h1>
                        <form onSubmit={handleSubmit} className=' flex flex-col lg:w-[30%]  bg-gradient-to-br from-blue-200 to-purple-200 p-5 rounded shadow-lg mt-5'>
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-5 lg:h-10 p-5 outline-0 bg-white' placeholder='Enter the Name' />
                            <input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-5 lg:h-10 p-5 outline-0 bg-white' placeholder='Enter the RollNumber' />
                            {deptLoading ? (
                                <div className=' w-full mb-2 mt-5 p-3'>Loading departments...</div>
                            ) : deptError ? (
                                <div className=' w-full mb-2 mt-5 p-3 text-red-600'>{deptError}</div>
                            ) : (
                                <select value={department} onChange={(e) => setDepartment(e.target.value)} className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-2 outline-0 bg-white'>
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d._id} value={d.departmentName}>{d.departmentName}</option>
                                    ))}
                                </select>
                            )}
                            <input value={batch} onChange={(e) => setBatch(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-5 lg:h-10 p-5 outline-0 bg-white' placeholder='Enter the Batch ex: 2023-2027' />
                            <button type='submit' className=' bg-green-600 px-10 py-2 w-fit mx-auto mt-5'>Add Student</button>
                        </form>
                        <div className=' mt-12 w-full lg:w-[60%]'>
                            <h3 className=' text-center font-bold text-lg mb-6 text-gray-800'>Or Upload Students via Excel</h3>
                            <div className=' border-3 border-dashed border-blue-400 rounded-xl p-10 flex flex-col justify-center items-center cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-300'>
                                <div className=' text-4xl mb-3'>📊</div>
                                <p className=' text-gray-700 font-semibold mb-2'>Drag & Drop Excel File</p>
                                <p className=' text-gray-500 text-sm'>or click to browse</p>
                                <input
                                    type='file'
                                    accept='.xlsx,.xls,.csv'
                                    className=' hidden'
                                    id='excelUpload'
                                    onChange={handleExcelFile}
                                />
                                <label htmlFor='excelUpload' className=' mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-blue-600 transition'>
                                    {excelFile ? excelFile.name : 'Choose File'}
                                </label>
                                <p className=' text-xs text-gray-500 mt-4'>Supported formats: .xlsx, .xls, .csv</p>
                            </div>

                            {excelData.length > 0 && (
                                <div className='mt-8 flex flex-col items-center bg-blue-50 p-6 rounded-lg border border-blue-200 w-full'>
                                    <h4 className='font-bold text-lg mb-4 text-blue-800'>Bulk Upload Settings</h4>
                                    <p className='text-green-600 mb-4 font-medium'>Loaded {excelData.length} students from Excel</p>

                                    <div className='w-full space-y-4'>
                                        <select
                                            value={bulkDepartment}
                                            onChange={(e) => setBulkDepartment(e.target.value)}
                                            className='border border-gray-400 w-full rounded h-10 p-2 outline-0 bg-white'
                                        >
                                            <option value="">Select Department for Batch</option>
                                            {departments.map((d) => (
                                                <option key={d._id} value={d.departmentName}>{d.departmentName}</option>
                                            ))}
                                        </select>

                                        <input
                                            value={bulkBatch}
                                            onChange={(e) => setBulkBatch(e.target.value)}
                                            type="text"
                                            className='border border-gray-400 w-full rounded h-10 p-2 outline-0 bg-white'
                                            placeholder='Enter Batch for these students (ex: 2023-2027)'
                                        />
                                    </div>

                                    <button
                                        onClick={handleBulkAdd}
                                        disabled={uploading}
                                        className={`mt-6 px-8 py-3 rounded text-white font-semibold shadow-md transition-all w-full md:w-auto ${uploading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Students to DB'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddStudent