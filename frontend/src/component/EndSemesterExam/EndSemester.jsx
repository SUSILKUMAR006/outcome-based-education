import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'
import axios from 'axios';

const EndSemester = () => {


    const url = "http://localhost:4000";
    const [allStudent, setAllStudents] = useState([]);
    const [CO1, setCO1] = useState('');
    const [CO2, setCO2] = useState('');
    const [CO3, setCO3] = useState('');
    const [CO4, setCO4] = useState('');
    const [CO5, setCO5] = useState('');
    const [CO6, setCO6] = useState('');
    const [CO1Code, setCO1Code] = useState('');
    const [CO2Code, setCO2Code] = useState('');
    const [CO3Code, setCO3Code] = useState('');
    const [CO4Code, setCO4Code] = useState('');
    const [CO5Code, setCO5Code] = useState('');
    const [CO6Code, setCO6Code] = useState('');
    const [studentMarks, setStudentMark] = useState([]);
    const [batch, setBatch] = useState();
    const [semester, setSemester] = useState();
    const [department, setDepartment] = useState();
    const [subject, setSubject] = useState();
    const [allDepartment, setAllDepartmet] = useState([]);
    const [allSubject, setAllSubject] = useState([]);
    const [attainment, setAttainment] = useState({ co1: 0, co2: 0, co3: 0, co4: 0, co5: 0, co6: 0, co1Value: 0, co2Value: 0, co3Value: 0, co4Value: 0, co5Value: 0, co6Value: 0 });
    const [levelco1, setLevelco1] = useState(0);
    const [levelco2, setLevelco2] = useState(0);
    const [levelco3, setLevelco3] = useState(0);
    const [levelco4, setLevelco4] = useState(0);
    const [levelco5, setLevelco5] = useState(0);
    const [levelco6, setLevelco6] = useState(0);
    const [target , setTarget] = useState();

    useEffect(() => {
        const getAllStudents = async () => {
            try {
                const response = await axios.get(`${url}/students/getAll`);
                setAllStudents(response.data);

                const marksData = response.data.map(student => ({
                    "id": student._id,
                    "mark1": "",
                    "mark2": "",
                    "mark3": "",
                    "mark4": "",
                    "mark5": "",
                    "mark6": "",
                    "total": ""

                }));
                setStudentMark(marksData);
            } catch (error) {
                console.log("Error fetching students:", error);
            }
        }


        const getAllDeparment = async () => {
            try {
                const responese = await axios.get(`${url}/departments/getAll`);
                setAllDepartmet(responese.data);
            } catch (error) {
                console.log("Department Fetching Error", error);
            }
        }

        const getAllSubject = async () => {
            try {
                const response = await axios.get(`${url}/subjects/getAll`);
                setAllSubject(response.data)
            } catch (error) {
                console.log("Error fetching subject", error);
            }
        }
        getAllStudents();
        getAllDeparment();
        getAllSubject();
    }, [])

    const filteredStudent = allStudent.filter(student => {
        const matchdept = department ? (student.department).toLowerCase() === department.toLowerCase() : true;
        const matchBatch = batch ? student.batch === batch : true;

        return matchBatch && matchdept;
    });



    const handleMarkChange = (id, field, rawValue) => {
        const value = rawValue === '' ? '' : Number(rawValue);
        const updatedMarks = studentMarks.map(mark => {
            if (mark.id !== id) return mark;
            const updatedMark = { ...mark, [field]: value };
            const mark1 = field === 'mark1' ? value : mark.mark1;
            const mark2 = field === 'mark2' ? value : mark.mark2;
            const mark3 = field === 'mark3' ? value : mark.mark3;
            const mark4 = field === 'mark4' ? value : mark.mark4;
            const mark5 = field === 'mark5' ? value : mark.mark5;
            const mark6 = field === 'mark6' ? value : mark.mark6;
            const total = (Number(mark1 || 0) + Number(mark2 || 0) + Number(mark3 || 0) + Number(mark4 || 0) + Number(mark5 || 0) + Number(mark6 || 0)).toFixed(1);
            return { ...updatedMark, total };
        });
        setStudentMark(updatedMarks);
    };


    const handleCalculate = () => {
        if (filteredStudent.length === 0) return;


        const targetCO1 = (CO1 * target/100).toFixed(1);
        const targetCO2 = (CO2 * target/100).toFixed(1);
        const targetCO3 = (CO3 * target/100).toFixed(1);
        const targetCO4 = (CO4 * target/100).toFixed(1);
        const targetCO5 = (CO5 * target/100).toFixed(1);
        const targetCO6 = (CO6 * target/100).toFixed(1);

        const attainedCO1 = studentMarks.filter(m => Number(m.mark1) >= targetCO1).length;
        const attainedCO2 = studentMarks.filter(m => Number(m.mark2) >= targetCO2).length;
        const attainedCO3 = studentMarks.filter(m => Number(m.mark3) >= targetCO3).length;
        const attainedCO4 = studentMarks.filter(m => Number(m.mark4) >= targetCO4).length;
        const attainedCO5 = studentMarks.filter(m => Number(m.mark5) >= targetCO5).length;
        const attainedCO6 = studentMarks.filter(m => Number(m.mark6) >= targetCO6).length;

        const denominator = filteredStudent.length || 1;
        const attainmentCO1 = ((attainedCO1 / denominator) * 100).toFixed(1);
        const attainmentCO2 = ((attainedCO2 / denominator) * 100).toFixed(1);
        const attainmentCO3 = ((attainedCO3 / denominator) * 100).toFixed(1);
        const attainmentCO4 = ((attainedCO4 / denominator) * 100).toFixed(1);
        const attainmentCO5 = ((attainedCO5 / denominator) * 100).toFixed(1);
        const attainmentCO6 = ((attainedCO6 / denominator) * 100).toFixed(1);

        setAttainment({ co1: attainmentCO1, co2: attainmentCO2, co3: attainmentCO3, co4: attainmentCO4, co5: attainmentCO5, co6: attainmentCO6, co1Value: attainedCO1, co2Value: attainedCO2, co3Value: attainedCO3, co4Value: attainedCO4, co5Value: attainedCO5, co6Value: attainedCO6 });

        const co1Level = Number(attainmentCO1);
        const co2Level = Number(attainmentCO2);
        const co3Level = Number(attainmentCO3);
        const co4Level = Number(attainmentCO4);
        const co5Level = Number(attainmentCO5);
        const co6Level = Number(attainmentCO6);

        setLevelco1(co1Level >= 89 ? 3 : co1Level >= 80 ? 2 : co1Level >= 70 ? 1 : 0);
        setLevelco2(co2Level >= 89 ? 3 : co2Level >= 80 ? 2 : co2Level >= 70 ? 1 : 0);
        setLevelco3(co3Level >= 89 ? 3 : co3Level >= 80 ? 2 : co3Level >= 70 ? 1 : 0);
        setLevelco4(co4Level >= 89 ? 3 : co4Level >= 80 ? 2 : co4Level >= 70 ? 1 : 0);
        setLevelco5(co5Level >= 89 ? 3 : co5Level >= 80 ? 2 : co5Level >= 70 ? 1 : 0);
        setLevelco6(co6Level >= 89 ? 3 : co6Level >= 80 ? 2 : co6Level >= 70 ? 1 : 0);
    };

    const handleSaveReport = async () => {
        try {
            console.log("▶ Starting End Semester report save...");
            console.log("Current values:", { batch, semester, department, subject, CO1, CO2, target });

            // Validation checks
            if (!filteredStudent.length) {
                alert("❌ No students to include in report! Please select batch and department.");
                return;
            }

            if (!batch || batch === "" || !semester || semester === "" || !department || department === "" || !subject || subject === "") {
                alert("❌ Please select Batch, Semester, Department, and Subject before saving!");
                return;
            }

            const totalCO = Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6);
            if (!CO1 || !CO2 || !CO3 || !CO4 || !CO5 || !CO6 || totalCO === 0) {
                alert("❌ Please enter all CO values (CO1-CO6) before saving!");
                return;
            }

            if (!target || target === "" || Number(target) === 0) {
                alert("❌ Please enter target percentage and calculate attainment before saving!");
                return;
            }

            if (attainment.co1 === 0 && attainment.co2 === 0 && attainment.co3 === 0) {
                alert("❌ Please click 'Calculate' button before saving the report!");
                return;
            }

            // 🟢 Build clean HTML report from scratch
            const reportHtml = `
                <div class="max-w-7xl mx-auto px-4 py-6 bg-white">
                    <!-- Logo -->
                    <div class="flex justify-center mb-6">
                        <img src="${assets.college_logo}" alt="College Logo" class="h-20" />
                    </div>

                    <!-- Title -->
                    <div class="text-center mb-6">
                        <h1 class="text-3xl font-bold text-gray-800">End Semester Exam Report</h1>
                        <p class="text-gray-600 mt-2">CO-wise Attainment Analysis</p>
                    </div>

                    <!-- Exam Details -->
                    <div class="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
                        <h3 class="text-xl font-semibold mb-3">Exam Details</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <p><strong>Department:</strong> ${department || 'N/A'}</p>
                            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                            <p><strong>Semester:</strong> ${semester || 'N/A'}</p>
                            <p><strong>Year/Batch:</strong> ${batch || 'N/A'}</p>
                            <p><strong>Total Students:</strong> ${filteredStudent.length}</p>
                        </div>
                    </div>

                    <!-- CO Values -->
                    <div class="mb-6 p-4 border border-gray-300 rounded bg-blue-50">
                        <h3 class="text-xl font-semibold mb-3">Course Outcome Maximum Marks</h3>
                        <div class="grid grid-cols-4 gap-4">
                            <p><strong>${CO1Code || 'CO1'}:</strong> ${CO1 || 0}</p>
                            <p><strong>${CO2Code || 'CO2'}:</strong> ${CO2 || 0}</p>
                            <p><strong>${CO3Code || 'CO3'}:</strong> ${CO3 || 0}</p>
                            <p><strong>${CO4Code || 'CO4'}:</strong> ${CO4 || 0}</p>
                            <p><strong>${CO5Code || 'CO5'}:</strong> ${CO5 || 0}</p>
                            <p><strong>${CO6Code || 'CO6'}:</strong> ${CO6 || 0}</p>
                            <p><strong>Total:</strong> ${(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6))}</p>
                        </div>
                    </div>

                    <!-- Student Marks Table -->
                    <div class="overflow-x-auto mb-6">
                        <table class="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr class="bg-green-300">
                                    <th class="border border-gray-300 px-4 py-3 text-center font-semibold" rowspan="2">SI.No</th>
                                    <th class="border border-gray-300 px-4 py-3 text-center font-semibold" rowspan="2">Register No</th>
                                    <th class="border border-gray-300 px-4 py-3 text-center font-semibold" rowspan="2">Student Name</th>
                                    <th class="border border-gray-300 px-4 py-3 text-center font-semibold" colspan="7">End Semester Exam</th>
                                </tr>
                                <tr class="bg-yellow-200">
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO1Code || 'CO1'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO2Code || 'CO2'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO3Code || 'CO3'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO4Code || 'CO4'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO5Code || 'CO5'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">${CO6Code || 'CO6'}</th>
                                    <th class="border border-gray-300 px-2 py-2 text-sm font-semibold">Total</th>
                                </tr>
                                <tr class="bg-purple-300">
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold" colspan="3">Max Marks</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO1 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO2 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO3 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO4 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO5 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${CO6 || 0}</td>
                                    <td class="border border-gray-300 px-2 py-2 text-center font-semibold">${(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6))}</td>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredStudent.map((student, index) => {
                                    const marks = studentMarks.find(m => m.id === student._id) || {};
                                    return `
                                        <tr class="${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}">
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${index + 1}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${student.rollNumber}</td>
                                            <td class="border border-gray-300 px-3 py-2 text-sm">${student.name}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark1 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark2 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark3 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark4 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark5 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm">${marks.mark6 ?? '-'}</td>
                                            <td class="border border-gray-300 px-2 py-2 text-center text-sm font-semibold">${marks.total ?? '-'}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Attainment Summary -->
                    <div class="overflow-x-auto mb-6">
                        <div class="border rounded-lg shadow-md bg-white">
                            <table class="min-w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 border-b">
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-left">Metric</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO1Code || 'CO1'}</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO2Code || 'CO2'}</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO3Code || 'CO3'}</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO4Code || 'CO4'}</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO5Code || 'CO5'}</th>
                                        <th class="border-r px-4 py-3 font-semibold text-sm text-center">${CO6Code || 'CO6'}</th>
                                        <th class="px-4 py-3 font-semibold text-sm text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-blue-50 border-b">
                                        <td class="border-r px-4 py-3 font-medium text-sm">Max Marks</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO1 || '-'}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO2 || '-'}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO3 || '-'}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO4 || '-'}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO5 || '-'}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${CO6 || '-'}</td>
                                        <td class="px-4 py-3 text-sm text-center font-semibold">${(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6)) || 0}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="border-r px-4 py-3 font-medium text-sm">Total Students</td>
                                        <td class="px-4 py-3 text-sm text-center font-semibold" colspan="7">${filteredStudent.length}</td>
                                    </tr>
                                    <tr class="bg-yellow-50 border-b">
                                        <td class="border-r px-4 py-3 font-medium text-sm">Target (%)</td>
                                        <td class="px-4 py-3 text-sm text-center font-semibold" colspan="7">${target || '-'}%</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="border-r px-4 py-3 font-medium text-sm">Target Value</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO1 / 100) * target).toFixed(1)}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO2 / 100) * target).toFixed(1)}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO3 / 100) * target).toFixed(1)}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO4 / 100) * target).toFixed(1)}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO5 / 100) * target).toFixed(1)}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center">${((CO6 / 100) * target).toFixed(1)}</td>
                                        <td class="px-4 py-3 text-sm text-center">-</td>
                                    </tr>
                                    <tr class="bg-green-50 border-b">
                                        <td class="border-r px-4 py-3 font-medium text-sm">Students Attained</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co1Value}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co2Value}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co3Value}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co4Value}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co5Value}</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-semibold">${attainment.co6Value}</td>
                                        <td class="px-4 py-3 text-sm text-center">-</td>
                                    </tr>
                                    <tr class="bg-blue-100">
                                        <td class="border-r px-4 py-3 font-semibold text-sm">Attainment %</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co1}%</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co2}%</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co3}%</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co4}%</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co5}%</td>
                                        <td class="border-r px-4 py-3 text-sm text-center font-bold text-blue-700">${attainment.co6}%</td>
                                        <td class="px-4 py-3 text-sm text-center">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- CO Attainment Levels -->
                    <div class="mt-10">
                        <h3 class="text-xl font-bold mb-4 text-gray-800">CO Attainment Levels</h3>
                        <div class="mb-10 border rounded-lg shadow-md bg-white max-w-2xl">
                            <table class="min-w-full border-collapse">
                                <thead>
                                    <tr class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                                        <th class="border-r border-white px-4 py-3 font-bold text-sm">Course Outcome</th>
                                        <th class="border-r border-white px-4 py-3 font-bold text-sm">Attainment %</th>
                                        <th class="px-4 py-3 font-bold text-sm">Level (0-3)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO1Code || 'CO1'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co1}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco1}</td>
                                    </tr>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO2Code || 'CO2'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co2}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco2}</td>
                                    </tr>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO3Code || 'CO3'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co3}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco3}</td>
                                    </tr>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO4Code || 'CO4'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co4}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco4}</td>
                                    </tr>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO5Code || 'CO5'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co5}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco5}</td>
                                    </tr>
                                    <tr class="hover:bg-gray-50">
                                        <td class="border-r px-4 py-3 font-semibold text-center">${CO6Code || 'CO6'}</td>
                                        <td class="border-r px-4 py-3 text-blue-700 font-semibold text-center">${attainment.co6}%</td>
                                        <td class="px-4 py-3 font-bold text-lg text-green-600 text-center">${levelco6}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
                            <h4 class="font-semibold mb-2 text-blue-900">Attainment Level Criteria:</h4>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li><strong>Level 3:</strong> ≥ 89%</li>
                                <li><strong>Level 2:</strong> 80% - 88%</li>
                                <li><strong>Level 1:</strong> 70% - 79%</li>
                                <li><strong>Level 0:</strong> &lt; 70%</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            // 🟢 Prepare data for backend
            const reportData = {
                batch: batch || 'N/A',
                department: department || 'N/A',
                subject: subject || 'N/A',
                semester: semester || 'N/A',
                totalStudents: filteredStudent?.length || 0,
                coValues: {
                    CO1: CO1 || 0,
                    CO2: CO2 || 0,
                    CO3: CO3 || 0,
                    CO4: CO4 || 0,
                    CO5: CO5 || 0,
                    CO6: CO6 || 0,
                },
                coCodes: {
                    CO1: CO1Code || "",
                    CO2: CO2Code || "",
                    CO3: CO3Code || "",
                    CO4: CO4Code || "",
                    CO5: CO5Code || "",
                    CO6: CO6Code || "",
                },
                // Store all CO codes for easy access in Final A Sheet
                allCoCodes: {
                    CO1: CO1Code || "",
                    CO2: CO2Code || "",
                    CO3: CO3Code || "",
                    CO4: CO4Code || "",
                    CO5: CO5Code || "",
                    CO6: CO6Code || "",
                },
                attainment: {
                    co1: attainment.co1,
                    co2: attainment.co2,
                    co3: attainment.co3,
                    co4: attainment.co4,
                    co5: attainment.co5,
                    co6: attainment.co6,
                    levels: {
                        co1: levelco1,
                        co2: levelco2,
                        co3: levelco3,
                        co4: levelco4,
                        co5: levelco5,
                        co6: levelco6,
                    }
                },
                studentMarks: filteredStudent.map(student => {
                    const marks = studentMarks.find(m => m.id === student._id) || {};
                    return {
                        studentId: student._id,
                        rollNumber: student.rollNumber,
                        name: student.name,
                        marks: {
                            mark1: marks.mark1 || '',
                            mark2: marks.mark2 || '',
                            mark3: marks.mark3 || '',
                            mark4: marks.mark4 || '',
                            mark5: marks.mark5 || '',
                            mark6: marks.mark6 || '',
                            total: marks.total || ''
                        }
                    };
                })
            };

            const hybridReport = {
                report_type: "endsem",
                report_html: reportHtml,
                report_data: reportData,
            };

            console.log("📤 Sending to backend:", {
                report_type: hybridReport.report_type,
                report_data_keys: Object.keys(reportData),
                html_length: reportHtml.length
            });

            const res = await axios.post(`${url}/reports/addReport`, hybridReport);
            console.log("✅ Response:", res.data);

            alert('✅ End Semester Report saved successfully!');
        } catch (error) {
            console.error("❌ Error saving report:", error);
            if (error.response) {
                // Server responded with error
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                alert(`❌ Error saving report: ${error.response.data?.error || error.response.data?.message || 'Server error'}`);
            } else if (error.request) {
                // Request made but no response
                console.error("No response received:", error.request);
                alert('❌ Error: Cannot connect to server. Please ensure the backend is running on http://localhost:4000');
            } else {
                // Something else happened
                alert(`❌ Error saving report: ${error.message}`);
            }
        }
    };

    return (
        <div className='bg-blue-100 pb-10 px-3 sm:px-5 lg:px-10 xl:px-15 pt-2 min-h-screen'>
            <Navbar />

            <div className='my-6 sm:my-10 bg-white px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded shadow-lg'>
                <div className='flex justify-center'>
                    <img src={assets.college_logo} alt="College Logo" className='h-12 sm:h-16 md:h-18 lg:h-20' />
                </div>
                <div>
                    <h1 className='text-center font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mt-6 sm:mt-8'>END SEMESTER RESULTS</h1>
                </div>

                <div className='flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center mt-6 sm:mt-8 lg:mt-10'>
                    <select onChange={(e) => setBatch(e.target.value)} className='border-2 py-2 px-3 sm:px-4 md:px-5 rounded font-semibold text-sm sm:text-base w-full lg:w-auto' name="" id="">
                        <option value="">Select the Batch</option>
                        {[...new Set(allStudent.map(student => student.batch))].map((batch, index) => (
                            <option key={index} value={batch}>{batch}</option>
                        ))}
                    </select>

                    <select onChange={(e) => setSemester(e.target.value)} className='border-2 py-2 px-3 sm:px-4 md:px-5 rounded font-semibold text-sm sm:text-base w-full lg:w-auto' name="" id="">
                        <option value="">Select the Semester</option>
                        <option value="Semester-1">Semester-1</option>
                        <option value="Semester-2">Semester-2</option>
                        <option value="Semester-3">Semester-3</option>
                        <option value="Semester-4">Semester-4</option>
                        <option value="Semester-5">Semester-5</option>
                        <option value="Semester-6">Semester-6</option>
                        <option value="Semester-7">Semester-7</option>
                        <option value="Semester-8">Semester-8</option>
                    </select>

                    <select onChange={(e) => setDepartment(e.target.value)} className='border-2 py-2 px-3 sm:px-4 md:px-5 rounded font-semibold text-sm sm:text-base w-full lg:w-auto' name="" id="">
                        <option value="">Select the Department</option>
                        {
                            allDepartment.map((dept) => (
                                <option key={dept._id} value={dept.departmentName}>{dept.departmentName}</option>
                            ))
                        }
                    </select>

                    <select onChange={(e) => setSubject(e.target.value)} className='border-2 py-2 px-3 sm:px-4 md:px-5 rounded font-semibold text-sm sm:text-base w-full lg:w-auto' name="" id="">
                        <option value="">Select the Subject</option>
                        {
                            allSubject.map((sub) => (
                                <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>
                            ))
                        }
                    </select>


                </div>

                {/* CO Code Input Section */}
                <div className='mt-4 sm:mt-5 p-3 sm:p-4 bg-gray-100 rounded border overflow-visible'>
                    <h3 className='font-semibold mb-3 text-sm sm:text-base'>Enter CO Codes:</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO1 Code:</label>
                            <input onChange={(e) => setCO1Code(e.target.value)} value={CO1Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.1' />
                        </div>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO2 Code:</label>
                            <input onChange={(e) => setCO2Code(e.target.value)} value={CO2Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.2' />
                        </div>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO3 Code:</label>
                            <input onChange={(e) => setCO3Code(e.target.value)} value={CO3Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.3' />
                        </div>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO4 Code:</label>
                            <input onChange={(e) => setCO4Code(e.target.value)} value={CO4Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.4' />
                        </div>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO5 Code:</label>
                            <input onChange={(e) => setCO5Code(e.target.value)} value={CO5Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.5' />
                        </div>
                        <div className='w-full'>
                            <label className='block text-xs sm:text-sm text-gray-600 mb-1'>CO6 Code:</label>
                            <input onChange={(e) => setCO6Code(e.target.value)} value={CO6Code} className='w-full border rounded px-2 py-1.5 text-center text-xs sm:text-sm bg-white' type="text" placeholder='C103.6' />
                        </div>
                    </div>
                </div>

       
       <div className='overflow-x-auto mt-6 sm:mt-8 lg:mt-10 -mx-4 sm:mx-0 shadow-sm border rounded-lg'> 
                    <table className='min-w-full bg-white border-collapse'>
                        <thead className='bg-green-300'>
                            <tr>
                                <th rowSpan={2} className='border border-gray-300 px-2 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>SI.No</th>
                                <th rowSpan={2} className='border border-gray-300 px-2 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-center whitespace-nowrap' style={{minWidth: '110px'}}>Register No</th>
                                <th rowSpan={2} className='border border-gray-300 px-3 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-center whitespace-nowrap' style={{minWidth: '180px'}}>Student Name</th>
                                <th colSpan={7} className='border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-semibold text-center'>End Semester Exam</th>
                            </tr>
                            <tr className='bg-yellow-200'>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO1Code || 'C103.1'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO2Code || 'C103.2'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO3Code || 'C103.3'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO4Code || 'C103.4'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO5Code || 'C103.5'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>{CO6Code || 'C103.6'}</th>
                                <th className='border border-gray-300 px-2 py-2 text-xs sm:text-sm font-semibold text-center whitespace-nowrap w-16'>Total</th>
                            </tr>
                            <tr className='bg-purple-200'>
                                <td colSpan={3} className='border border-gray-300 px-3 py-2 text-xs sm:text-sm font-semibold text-center'>Max Marks</td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO1(e.target.value)} value={CO1} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO2(e.target.value)} value={CO2} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO3(e.target.value)} value={CO3} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO4(e.target.value)} value={CO4} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO5(e.target.value)} value={CO5} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-1 py-2'>
                                    <input onChange={(e) => setCO6(e.target.value)} value={CO6} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" placeholder="0" />
                                </td>
                                <td className='bg-purple-300 border border-gray-300 px-2 py-2 text-center'>
                                    <span className='text-xs sm:text-sm font-semibold whitespace-nowrap'>{(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6)) === 100 ? '✓ 100' : `${(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6))}/100`}</span>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredStudent.length > 0 ? (
                       filteredStudent.map((student, index) => {
                        const marks = studentMarks.find(mark => mark.id === student._id) || {};

                        return (
                            <tr key={student._id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                                <td className='border border-gray-300 px-2 py-2 text-xs sm:text-sm text-center'>{index + 1}</td>
                                <td className='border border-gray-300 px-2 py-2 text-xs sm:text-sm text-center whitespace-nowrap'>{student.rollNumber}</td>
                                <td className='border border-gray-300 px-3 py-2 text-xs sm:text-sm' style={{minWidth: '180px'}}>{student.name}</td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark1 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark1', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark2 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark2', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark3 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark3', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark4 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark4', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark5 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark5', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.mark6 ?? ""} onChange={(e) => handleMarkChange(student._id, 'mark6', e.target.value)} className='w-14 h-8 rounded text-center border py-1 text-xs sm:text-sm' type="number" />
                                </td>
                                <td className='border border-gray-300 px-1 py-2'>
                                    <input value={marks.total ?? ""} className='w-14 h-8 rounded text-center border py-1 bg-gray-100 font-semibold text-xs sm:text-sm' type="text" readOnly />
                                </td>
                            </tr>
                        )
                    })
                   
                ) : (
                    <tr>
                        <td colSpan={10} className='border border-gray-300 py-4 sm:py-5 text-center text-red-600 font-semibold text-sm sm:text-base'>No students found for the selected criteria</td>
                    </tr>
                )}
                        </tbody>
                    </table>
</div>
                <div className='flex justify-center sm:justify-end mt-4 sm:mt-6 lg:mt-8'>
                    <button onClick={handleCalculate} className='bg-green-700 py-2 px-8 sm:px-10 hover:scale-105 transition-all duration-300 cursor-pointer font-semibold text-base sm:text-lg rounded text-white shadow-md w-full sm:w-auto' type="button">Calculate</button>
                </div>
                <div className='overflow-x-auto -mx-4 sm:mx-0 mt-6 sm:mt-8 lg:mt-10'>
                    <div className='border rounded-lg shadow-md bg-white min-w-max sm:min-w-0'>
                    <div className='grid grid-cols-8 border-b bg-gray-100'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm'>Metric</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO1Code || 'CO1'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO2Code || 'CO2'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO3Code || 'CO3'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO4Code || 'CO4'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO5Code || 'CO5'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO6Code || 'CO6'}</h2>
                        <h2 className='text-center py-2 sm:py-3 font-semibold text-xs sm:text-sm'>Total</h2>
                    </div>
                    <div className='grid grid-cols-8 border-b bg-blue-50'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Max Marks</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO1 || '-'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO2 || '-'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO3 || '-'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO4 || '-'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO5 || '-'}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{CO6 || '-'}</h2>
                        <h2 className='text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{(Number(CO1) + Number(CO2) + Number(CO3) + Number(CO4) + Number(CO5) + Number(CO6)) || 0}</h2>
                    </div>
                    <div className='grid grid-cols-8 border-b'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Total Students</h2>
                        <h2 className='col-span-7 text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{filteredStudent.length}</h2>
                    </div>
                    <div className='grid grid-cols-8 border-b bg-yellow-50'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Target (%)</h2>
                        <h2 className='col-span-7 py-2 px-2 sm:px-4'>
                            <input className='text-center border rounded w-24 sm:w-32 px-2 py-1 font-semibold text-xs sm:text-sm' type="text" value={target} onChange={(e)=> setTarget(e.target.value)} placeholder="Enter %" />
                        </h2>
                    </div>
                    <div className='grid grid-cols-8 border-b'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Target Value</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO1 / 100) * target).toFixed(1)}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO2 / 100) * target).toFixed(1)}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO3 / 100) * target).toFixed(1)}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO4 / 100) * target).toFixed(1)}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO5 / 100) * target).toFixed(1)}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm'>{((CO6 / 100) * target).toFixed(1)}</h2>
                        <h2 className='text-center py-2 sm:py-3 text-xs sm:text-sm'>-</h2>
                    </div>
                    <div className='grid grid-cols-8 border-b bg-green-50'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm'>Students Attained</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co1Value}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co2Value}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co3Value}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co4Value}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co5Value}</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-semibold'>{attainment.co6Value}</h2>
                        <h2 className='text-center py-2 sm:py-3 text-xs sm:text-sm'>-</h2>
                    </div>
                    <div className='grid grid-cols-8 bg-blue-100'>
                        <h2 className='border-r px-2 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm'>Attainment %</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co1}%</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co2}%</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co3}%</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co4}%</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co5}%</h2>
                        <h2 className='border-r text-center py-2 sm:py-3 text-xs sm:text-sm font-bold text-blue-700'>{attainment.co6}%</h2>
                        <h2 className='text-center py-2 sm:py-3 text-xs sm:text-sm'>-</h2>
                    </div>
                </div>
                </div>

                <div className='overflow-x-auto -mx-4 sm:mx-0 mt-6 sm:mt-8 lg:mt-10'>
                    <h3 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 px-4 sm:px-0'>CO Attainment Levels</h3>
                    <div className='mb-6 sm:mb-10 border rounded-lg shadow-md bg-white max-w-full sm:max-w-2xl min-w-max sm:min-w-0'>
                    <div className='grid grid-cols-3 border-b text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white'>
                        <h2 className='border-r py-2 sm:py-3 font-bold text-xs sm:text-sm'>Course Outcome</h2>
                        <h2 className='border-r py-2 sm:py-3 font-bold text-xs sm:text-sm'>Attainment %</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-xs sm:text-sm'>Level (0-3)</h2>
                    </div>
                    <div className='grid grid-cols-3 border-b text-center hover:bg-gray-50'>
                        <h2 className='py-2 sm:py-3 border-r font-semibold text-xs sm:text-sm'>{CO1Code || 'C103.1'}</h2>
                        <h2 className='py-2 sm:py-3 border-r text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co1}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco1}</h2>
                    </div>
                    <div className='grid grid-cols-3 border-b text-center hover:bg-gray-50'>
                        <h2 className='py-2 sm:py-3 border-r font-semibold text-xs sm:text-sm'>{CO2Code || 'C103.2'}</h2>
                        <h2 className='py-2 sm:py-3 border-r text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co2}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco2}</h2>
                    </div>
                    <div className='grid grid-cols-3 border-b text-center hover:bg-gray-50'>
                        <h2 className='border-r py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO3Code || 'C103.3'}</h2>
                        <h2 className='border-r py-2 sm:py-3 text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co3}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco3}</h2>
                    </div>
                    <div className='grid grid-cols-3 border-b text-center hover:bg-gray-50'>
                        <h2 className='border-r py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO4Code || 'C103.4'}</h2>
                        <h2 className='border-r py-2 sm:py-3 text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co4}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco4}</h2>
                    </div>
                    <div className='grid grid-cols-3 border-b text-center hover:bg-gray-50'>
                        <h2 className='border-r py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO5Code || 'C103.5'}</h2>
                        <h2 className='border-r py-2 sm:py-3 text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co5}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco5}</h2>
                    </div>
                    <div className='grid grid-cols-3 text-center hover:bg-gray-50'>
                        <h2 className='border-r py-2 sm:py-3 font-semibold text-xs sm:text-sm'>{CO6Code || 'C103.6'}</h2>
                        <h2 className='border-r py-2 sm:py-3 text-blue-700 font-semibold text-xs sm:text-sm'>{attainment.co6}%</h2>
                        <h2 className='py-2 sm:py-3 font-bold text-base sm:text-lg text-green-600'>{levelco6}</h2>
                    </div>
                </div>
                <div className='mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-full sm:max-w-2xl'>
                    <h4 className='font-semibold mb-2 text-blue-900 text-sm sm:text-base'>Attainment Level Criteria:</h4>
                    <ul className='text-xs sm:text-sm text-gray-700 space-y-1'>
                        <li><strong>Level 3:</strong> ≥ 89%</li>
                        <li><strong>Level 2:</strong> 80% - 88%</li>
                        <li><strong>Level 1:</strong> 70% - 79%</li>
                        <li><strong>Level 0:</strong> &lt; 70%</li>
                    </ul>
                </div>
                </div>
            </div>

            <button
                onClick={handleSaveReport}
                className="bg-blue-700 py-2 px-6 sm:px-8 text-white rounded hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
                Save Report
            </button>
        </div>
    )
}

export default EndSemester