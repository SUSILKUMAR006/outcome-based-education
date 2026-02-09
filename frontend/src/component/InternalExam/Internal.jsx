import React, { useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets.js';
import axios from 'axios';
import { useEffect } from 'react';




const Internal = () => {

  const [allStudents, setAllStudents] = useState([]);
  const url = "http://localhost:4000";
  const [internalSelection, setInternalSelection] = useState("IAT-1");
  const [CO1, setCO1] = useState("");
  const [CO2, setCO2] = useState("");
  const [CO3, setCO3] = useState("");
  const [CO4, setCO4] = useState("");
  const [CO5, setCO5] = useState("");
  const [CO6, setCO6] = useState("");
  const [CO1Code, setCO1Code] = useState("");
  const [CO2Code, setCO2Code] = useState("");
  const [CO3Code, setCO3Code] = useState("");
  const [CO4Code, setCO4Code] = useState("");
  const [CO5Code, setCO5Code] = useState("");
  const [CO6Code, setCO6Code] = useState("");
  const [assignment1, setAssignment1] = useState("");
  const [assignment2, setAssignment2] = useState("");
  const [assignment1Code, setAssignment1Code] = useState("");
  const [assignment2Code, setAssignment2Code] = useState("");
  const [message, setMessage] = useState('');
  const [studentMarks, setStudentMaks] = useState([]);
  const [studentAssignmentMarks, setStudentAssignmentMarks] = useState([]);
  const [levelco1, setLevelco1] = useState(0);
  const [levelco2, setLevelco2] = useState(0);
  const [levelAssignment1, setLevelAssignment1] = useState(0);
  const [levelAssignment2, setLevelAssignment2] = useState(0);
  const [department, setDepartment] = useState([]);
  const [subject, setSubject] = useState([]);
  const [batch, setBatch] = useState();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [reportData, setReportData] = useState({});
  const [target, setTarget] = useState();
  
  // Helper to get currently active CO pair based on IAT selection
  const getActiveCOs = () => {
    if (internalSelection === "IAT-1") {
      return { a: Number(CO1) || 0, b: Number(CO2) || 0, aName: "CO1", bName: "CO2" };
    }
    if (internalSelection === "IAT-2") {
      return { a: Number(CO3) || 0, b: Number(CO4) || 0, aName: "CO3", bName: "CO4" };
    }
    return { a: Number(CO5) || 0, b: Number(CO6) || 0, aName: "CO5", bName: "CO6" };
  };
  
  useEffect(() => {
    const getStudent = async () => {
      try {
        const response = await axios.get(`${url}/students/getAll`);
        setAllStudents(response.data);


        const marksData = response.data.map(student => ({
          "id": student._id,
          "mark1": "",
          "mark2": "",
          "total": ""
        }));

        const assignmentMarksData = response.data.map(student => ({
          "id": student._id,
          "assignmentMark1": "",
          "assignmentMark2": "",
          "assignmentTotal": ""
        }));
        setStudentAssignmentMarks(assignmentMarksData);
        setStudentMaks(marksData);
      } catch (error) {
        console.log("Error fetching students:", error);
      }
    };

    const getDeparment = async () => {
      try {
        const response = await axios.get(`${url}/departments/getAll`);
        setDepartment(response.data);

        // console.log("Departments:", response.data);
      } catch (error) {
        console.log("Error fetching department:", error);
      }
    }

    const getSubjects = async () => {
      try {
        const response = await axios.get(`${url}/subjects/getAll`);
        setSubject(response.data);
        // console.log("Subjects:", response.data);
      } catch (error) {
        console.log("Error fetching subjects:", error);
      }
    }

    const getReport = async () => {
      const response = await axios.get(`${url}/reports/getAll`);
      console.log("Reports:", response.data);
      setReportData(response.data);
    }
    getStudent();
    getDeparment();
    getSubjects();
    getReport();
  }, []);



  const handleCheck = () => {
    const { a, b, aName, bName } = getActiveCOs();
    const total = Number(a) + Number(b);
    const assignmentTotal = Number(assignment1) + Number(assignment2);
    if (total === 50 && assignmentTotal === 50) {
      setMessage(`✅ Perfect! ${aName} + ${bName} = 50 and Assignments = 50`);
    } else {
      setMessage(`⚠️ Total = ${total}. It should be 50.`);
    }
  };

  const handleMarkChange = (id, field, rawValue) => {
    const value = Number(rawValue) || 0;
    const updatedMarks = studentMarks.map(mark => {
      if (mark.id !== id) return mark;
      const mark1 = field === 'mark1' ? value : Number(mark.mark1) || 0;
      const mark2 = field === 'mark2' ? value : Number(mark.mark2) || 0;
      return { ...mark, mark1, mark2, total: (mark1 + mark2).toFixed(1) };
    });
    setStudentMaks(updatedMarks);
  };

  const handleAssignmentChange = (id, field, rawValue) => {
    const value = Number(rawValue) || 0;
    const updatedMarks = studentAssignmentMarks.map(mark => {
      if (mark.id !== id) return mark;
      const assignmentMark1 = field === 'assignmentMark1' ? value : Number(mark.assignmentMark1) || 0;
      const assignmentMark2 = field === 'assignmentMark2' ? value : Number(mark.assignmentMark2) || 0;
      return { ...mark, assignmentMark1, assignmentMark2, assignmentTotal: (assignmentMark1 + assignmentMark2).toFixed(1) };
    });
    setStudentAssignmentMarks(updatedMarks);
  };


  const [attainment, setAttainment] = useState({ co1: 0, co2: 0, co1Value: 0, co2Value: 0 });
  const [attainmentAssignments, setAttainmentAssignments] = useState({ assign1: 0, assign2: 0, assign1Value: 0, assign2Value: 0 });

  const handleCalculate = () => {
    if (filteredStudents.length === 0) return;

    const { a, b } = getActiveCOs();
    const targetCO1 = (a * target/100).toFixed(1);
    const targetCO2 = (b * target/100).toFixed(1);
    const assignmentTarget1 = (assignment1 * target/100).toFixed(1);
    const assignmentTarget2 = (assignment2 * target/100).toFixed(1);

    const attainedCO1 = studentMarks.filter(m => Number(m.mark1) >= targetCO1).length;
    const attainedCO2 = studentMarks.filter(m => Number(m.mark2) >= targetCO2).length;
    const attainedAssignment1 = studentAssignmentMarks.filter(m => Number(m.assignmentMark1) >= assignmentTarget1).length;
    const attainedAssignment2 = studentAssignmentMarks.filter(m => Number(m.assignmentMark2) >= assignmentTarget2).length;

    const denominator = filteredStudents.length || 1;
    const attainmentCO1 = ((attainedCO1 / denominator) * 100).toFixed(1);
    const attainmentCO2 = ((attainedCO2 / denominator) * 100).toFixed(1);
    const attainmentAssignment1 = ((attainedAssignment1 / denominator) * 100).toFixed(1);
    const attainmentAssignment2 = ((attainedAssignment2 / denominator) * 100).toFixed(1);

    setAttainmentAssignments({ assign1: attainmentAssignment1, assign2: attainmentAssignment2, assign1Value: attainedAssignment1, assign2Value: attainedAssignment2 });
    setAttainment({ co1: attainmentCO1, co2: attainmentCO2, co1Value: attainedCO1, co2Value: attainmentCO2 });

    // Levels based on freshly computed values
    const co1Pct = Number(attainmentCO1);
    const co2Pct = Number(attainmentCO2);
    const a1Pct = Number(attainmentAssignment1);
    const a2Pct = Number(attainmentAssignment2);

    setLevelco1(co1Pct >= 89 ? 3 : co1Pct >= 80 ? 2 : co1Pct >= 70 ? 1 : 0);
    setLevelco2(co2Pct >= 89 ? 3 : co2Pct >= 80 ? 2 : co2Pct >= 70 ? 1 : 0);
    setLevelAssignment1(a1Pct >= 89 ? 3 : a1Pct >= 80 ? 2 : a1Pct >= 70 ? 1 : 0);
    setLevelAssignment2(a2Pct >= 89 ? 3 : a2Pct >= 80 ? 2 : a2Pct >= 70 ? 1 : 0);

  };

  // Reset marks and attainment when IAT selection changes
  useEffect(() => {
    const marksData = allStudents.map(student => ({
      id: student._id,
      mark1: "",
      mark2: "",
      total: ""
    }));
    const assignmentMarksData = allStudents.map(student => ({
      id: student._id,
      assignmentMark1: "",
      assignmentMark2: "",
      assignmentTotal: ""
    }));
    setStudentMaks(marksData);
    setStudentAssignmentMarks(assignmentMarksData);
    setMessage("");
    setAttainment({ co1: 0, co2: 0, co1Value: 0, co2Value: 0 });
    setAttainmentAssignments({ assign1: 0, assign2: 0, assign1Value: 0, assign2Value: 0 });
    setLevelco1(0);
    setLevelco2(0);
    setLevelAssignment1(0);
    setLevelAssignment2(0);
  }, [internalSelection, allStudents]);

  const filteredStudents = allStudents.filter(student => {
    const matchdept = selectedDepartment ? (student.department).toLowerCase() === selectedDepartment.toLowerCase() : true;
    const matchbatch = batch ? student.batch === batch : true;

    return matchdept && matchbatch;
  });

const handleSaveReport = async () => {
  try {
    console.log("▶ Starting report save...");

    const reportContainer = document.querySelector('.my-10.bg-white');
    if (!reportContainer) {
      alert("❌ Report section not found on page!");
      return;
    }

    // Clone a fresh copy of the report
    const reportElement = reportContainer.cloneNode(true);

    // 🧹 Remove previously added blocks (to avoid duplicates)
    reportElement.querySelectorAll('.generated-block').forEach(el => el.remove());
    
    // 🚫 Remove the unwanted content sections
    const unwantedSelectors = [
      '.flex.my-10', // Remove previously generated logo container
      '.flex.my-5',  // Remove inline logo from the on-page view
      'h1.text-3xl.font-bold', // Remove "Internal Exam Calculations" heading
      'p.text-gray-600', // Remove description paragraph
      '.flex.flex-wrap.gap-5.justify-between.mx-0.mt-10', // Remove all selection fields
      '.flex.gap-3.mt-10', // Remove IAT selection buttons
      '.flex.mt-5.items-center.gap-3' // Remove CO input form
    ];
    
    unwantedSelectors.forEach(selector => {
      const elements = reportElement.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // 🟢 Add college logo at the top
    const logoContainer = document.createElement('div');
    logoContainer.className = 'flex my-10 justify-center generated-block';
    logoContainer.innerHTML = `<img src="${assets.college_logo}" alt="College Logo" />`;
    reportElement.prepend(logoContainer);

    // 🟢 Add report title
    const titleSection = document.createElement('div');
    titleSection.className = 'mb-6 generated-block';
    titleSection.innerHTML = `
      <h1 class="text-3xl font-bold text-center">Internal Exam Report</h1>
      <p class="text-gray-600 text-center mt-2">CO-wise Attainment Analysis</p>
    `;
    reportElement.prepend(titleSection);

    // 🟢 Add selected info block (Year, Sem, Dept, Subject)
    const department = selectedDepartment || 'N/A';
    const subject = selectedSubject || 'N/A';
    const semesterValue = typeof selectedSemester !== 'undefined' ? selectedSemester : 'N/A';
    
    const selectedInfo = document.createElement('div');
    selectedInfo.className = 'mb-6 p-4 border border-gray-300 rounded bg-gray-50 generated-block';
    selectedInfo.innerHTML = `
      <h3 class="text-xl font-semibold mb-3">Exam Details</h3>
      <div class="grid grid-cols-2 gap-4">
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Semester:</strong> ${semesterValue}</p>
        <p><strong>Year/Batch:</strong> ${batch || 'N/A'}</p>
        <p><strong>Internal Exam:</strong> ${internalSelection}</p>
        <p><strong>Total Students:</strong> ${filteredStudents?.length || 0}</p>
      </div>
    `;
    reportElement.prepend(selectedInfo);

    // 🟢 Add CO and Assignment values section
    const { a: activeCO1, b: activeCO2, aName, bName } = getActiveCOs();
    const co1Val = activeCO1 || '—';
    const co2Val = activeCO2 || '—';
    const a1Val = assignment1 || document.querySelector('input[name="assign1"]')?.value || '—';
    const a2Val = assignment2 || document.querySelector('input[name="assign2"]')?.value || '—';

    const coValuesSection = document.createElement('div');
    coValuesSection.className = 'mb-6 p-4 border border-gray-300 rounded bg-blue-50 generated-block';
    coValuesSection.innerHTML = `
      <h3 class="text-xl font-semibold mb-3">CO and Assignment Values</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="font-semibold mb-2">Course Outcomes</h4>
          <p><strong>${aName}:</strong> ${co1Val}</p>
          <p><strong>${bName}:</strong> ${co2Val}</p>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Assignments</h4>
          <p><strong>Assignment A:</strong> ${a1Val}</p>
          <p><strong>Assignment B:</strong> ${a2Val}</p>
        </div>
      </div>
    `;
    reportElement.prepend(coValuesSection);

    // 🟢 Build final HTML
    const reportHtml = reportElement.outerHTML;

    // 🟢 Prepare data for backend
    const reportData = {
      batch: batch || 'N/A',
      department,
      subject,
      semester: semesterValue,
      internalType: internalSelection,
      totalStudents: filteredStudents?.length || 0,
      coValues: {
        [aName]: co1Val,
        [bName]: co2Val,
        Assignment1: a1Val,
        Assignment2: a2Val,
      },
      coCodes: {
        CO1: CO1Code || "",
        CO2: CO2Code || "",
        CO3: CO3Code || "",
        CO4: CO4Code || "",
        CO5: CO5Code || "",
        CO6: CO6Code || "",
        Assignment1: assignment1Code || "",
        Assignment2: assignment2Code || "",
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
      allAssignmentCodes: {
        Assignment1: assignment1Code || "",
        Assignment2: assignment2Code || "",
      },
      attainment: {
        co1: attainment.co1,
        co2: attainment.co2,
        assignment1: attainmentAssignments.assign1,
        assignment2: attainmentAssignments.assign2,
        levels: {
          co1: levelco1,
          co2: levelco2,
          assignment1: levelAssignment1,
          assignment2: levelAssignment2,
        }
      },
      studentMarks: filteredStudents.map(student => {
        const marks = studentMarks.find(m => m.id === student._id) || {};
        const assignmentMarks = studentAssignmentMarks.find(m => m.id === student._id) || {};
        return {
          studentId: student._id,
          rollNumber: student.rollNumber,
          name: student.name,
          marks: {
            mark1: marks.mark1 || '',
            mark2: marks.mark2 || '',
            total: marks.total || ''
          },
          assignmentMarks: {
            assignmentMark1: assignmentMarks.assignmentMark1 || '',
            assignmentMark2: assignmentMarks.assignmentMark2 || '',
            assignmentTotal: assignmentMarks.assignmentTotal || ''
          }
        };
      })
    };

    const hybridReport = {
      report_type: "internal",
      report_html: reportHtml,
      report_data: reportData,
    };

    console.log("📤 Sending to backend:", hybridReport);

    const res = await axios.post(`${url}/report/addReport`, hybridReport);
    console.log("✅ Response:", res.data);

    alert('✅ Report saved successfully with college logo and cleaned content!');
  } catch (error) {
    console.error("❌ Error saving report:", error);
    alert('❌ Error saving report — check console.');
  }
};





  return (
    <div className='bg-blue-100 pb-10 px-3 lg:px-15 pt-2'>
      <Navbar />

      <div className=' my-10 bg-white px-5 lg:px-10 py-5 rounded shadow-lg'>
        <div className=' flex my-5'>

          <img className=' mx-auto lg:h-18' src={assets.college_logo} alt="" />

        </div>
        <div>
          <h1 className=' text-xl lg:text-2xl font-bold '>Internal Exam Calculations</h1>
          <p className=' text-gray-600 '>Enter IAT marks, assignments and calculate CO-wise attainment</p>
        </div>
        




        {/* select the department , year , subject */}
        <div className=' flex flex-wrap gap-5 justify-between mx-0 mt-10'>

          <select value={batch} onChange={(e) => setBatch(e.target.value)} className=' border rounded  py-1 px-3 w-full lg:w-fit' name="" id="">
            <option value="">Select the Year</option>
            {[...new Set(allStudents.map(student => student.batch))].map((batch, index) => (
              <option key={index} value={batch}>{batch}</option>
            ))}
          </select>
          <select value={selectedSemester} onChange={(e)=> setSelectedSemester(e.target.value)} className=' border rounded  py-1 px-3 w-full lg:w-fit' name="" id="">
            <option value="">Select the Semester</option>
            <option value="semester-1 ">Semester 1</option>
            <option value="semester-2">Semester 2</option>
            <option value="semester-3">Semester 3</option>
            <option value="semester-4">Semester 4</option>
            <option value="semester-5">Semester 5</option>
            <option value="semester-6">Semester 6</option>
            <option value="semester-7">Semester 7</option>
            <option value="semester-8">Semester 8</option>
          </select>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className=' border rounded  py-1 px-3 w-full lg:w-fit' name="" id="">
            <option value="">Select the Department</option>
            {department.map((dept) => (
              <option key={dept._id} value={dept.departmentName}>{dept.departmentName}</option>
            ))}
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className=' border rounded  py-1 px-3 h-10 overflow-scroll w-full lg:w-fit' name="" id="">
            <option value="">Select the Subject</option>
            {subject.map((sub) => (
              <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>
            ))
            }
          </select>
        </div>

        <div className=' flex justify-between lg:justify-start gap-3 mt-10'>
          <h3 onClick={() => setInternalSelection("IAT-1")} className={internalSelection === "IAT-1" ? ' bg-blue-400 py-1 px-3  rounded cursor-pointer text-sm lg:text-md' : " cursor-pointer bg-blue-200 py-1 px-3  rounded text-sm lg:text-md"}>IAT - I</h3>
          <h3 onClick={() => setInternalSelection("IAT-2")} className={internalSelection === "IAT-2" ? ' bg-blue-400 py-1 px-3  rounded cursor-pointer text-sm lg:text-md' : " cursor-pointer bg-blue-200 py-1 px-3  rounded text-sm lg:text-md"}>IAT - II</h3>
          <h3 onClick={() => setInternalSelection("IAT-3")} className={internalSelection === "IAT-3" ? ' bg-blue-400 py-1 px-3  rounded cursor-pointer text-sm lg:text-md' : " cursor-pointer bg-blue-200 py-1 px-3  rounded text-sm lg:text-md"}>IAT - III</h3>
        </div>

        <div className=' flex flex-wrap justify-start lg:justify-center  mt-5 items-center '>
          {internalSelection === "IAT-1" &&
            <div className=''>
              <form className=' grid grid-cols-1 lg:grid-cols-4   gap-3 items-center'>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setCO1Code(e.target.value)} value={CO1Code || 301.1} className=' border rounded w-20 text-center' type='text' placeholder='C103.1' />
                  <h2>CO1 Code:</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setCO1(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>CO1</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setCO2Code(e.target.value)} value={CO2Code || 301.2} className=' border rounded w-20 text-center' type='text' placeholder='C103.2' />
                  <h2>CO2 Code:</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setCO2(e.target.value)} className=' border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>CO2</h2>
                </div>
                
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setAssignment1Code(e.target.value)} value={assignment1Code || "A1"} className=' border rounded w-20 text-center' type='text' placeholder='A1' />
                  <h2>Assignment - A Code:</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setAssignment1(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>Assignment - A</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setAssignment2Code(e.target.value)} value={assignment2Code || "A2"} className=' border rounded w-20 text-center' type='text' placeholder='A2' />
                  <h2>Assignment - B Code:</h2>
                </div>
                <div className='flex items-center justify-start gap-2'>
                  <input onChange={(e) => setAssignment2(e.target.value)} className='border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>Assignment - B</h2>
                </div>
              </form>
            </div>
            }
          {internalSelection === "IAT-2" &&
            <div>
              <form className=' grid lg:grid-cols-4  gap-3 items-center'>
                <div className='flex items-center gap-2'>
                  <input onChange={(e) => setCO3Code(e.target.value)} value={CO3Code || 301.3} className=' border rounded w-20 text-center' type='text' placeholder='C103.3' />
                  <h2>CO3 Code:</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setCO3(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>CO3</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setCO4Code(e.target.value)} value={CO4Code || 301.4} className=' border rounded w-20 text-center' type='text' placeholder='C103.4' />
                  <h2>CO4 Code:</h2>
                </div>
                <div className='flex items-center gap-2'>
                  <input onChange={(e) => setCO4(e.target.value)} className=' border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>CO4</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment1Code(e.target.value)} value={assignment1Code || "A1"} className=' border rounded w-20 text-center' type='text' placeholder='A1' />
                  <h2>Assignment - A Code:</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment1(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>Assignment - A</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment2Code(e.target.value)} value={assignment2Code || "A2"} className=' border rounded w-20 text-center' type='text' placeholder='A2' />
                  <h2>Assignment - B Code:</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment2(e.target.value)} className=' border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>Assignment - B</h2>
                </div>
              </form>
            </div>}
          {internalSelection === "IAT-3" &&
            <div>
              <form className=' grid lg:grid-cols-4 gap-3 items-center'>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setCO5Code(e.target.value)} value={CO5Code || 301.5} className=' border rounded w-20 text-center' type='text' placeholder='C103.5' />
                  <h2>CO5 Code:</h2>
                </div>
                <div className='flex items-center   gap-2'>
                  <input onChange={(e) => setCO5(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>CO5</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setCO6Code(e.target.value)} value={CO6Code || 301.6} className=' border rounded w-20 text-center' type='text' placeholder='C103.6' />
                  <h2>CO6 Code:</h2>
                </div>
                <div className='flex items-center   gap-2'>
                  <input onChange={(e) => setCO6(e.target.value)} className=' border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>CO6</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment1Code(e.target.value)} value={assignment1Code || "A1"} className=' border rounded w-20 text-center' type='text' placeholder='A1' />
                  <h2>Assignment - A Code:</h2>
                </div>
                <div className='flex items-center   gap-2'>
                  <input onChange={(e) => setAssignment1(e.target.value)} className=' border rounded w-20 text-center' type='number' name='' id='' />
                  <h2>Assignment - A</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment2Code(e.target.value)} value={assignment2Code || "A2"} className=' border rounded w-20 text-center' type='text' placeholder='A2' />
                  <h2>Assignment - B Code:</h2>
                </div>
                <div className='flex items-center  gap-2'>
                  <input onChange={(e) => setAssignment2(e.target.value)} className='border rounded w-20 text-center' type='number' name="" id="" />
                  <h2>Assignment - B</h2>
                </div>
              </form>
            </div>}
          
        </div>
        <div className="mt-15 overflow-auto">
          <div className='border w-300 lg:w-full grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr] overflow-auto'>

            <h2 className='border-r py-1 pl-4 text-center place-content-center bg-green-300'>S.No</h2>
            <h2 className='border-r py-1 pl-4 text-center place-content-center bg-green-300'>Roll Number</h2>
            <h2 className=' border-r py-1 pl-4 text-center place-content-center bg-green-300' >Student Name</h2>
            <div>
              <h2 className=' text-center border py-5 bg-green-300'>PT-1</h2>
              <div className=' grid grid-cols-3 border text-center bg-yellow-200'>
                <p className=' border-r py-2'>C103.1</p>
                <p className=' border-r py-2'>C103.2</p>
                <p className=' py-2'>Total</p>
              </div>
              <div className=' grid grid-cols-3 border text-center bg-purple-300'>
                {(() => { const { a, b } = getActiveCOs(); return (
                  <>
                    <p className=' border-r py-1'>{a === 0 ? 0 : a}</p>
                    <p className=' border-r py-1'>{b === 0 ? 0 : b}</p>
                    <p className=' py-1'>{(a + b) === 0 ? 0 : (Number(a) + Number(b))}</p>
                  </>
                ); })()}
              </div>
            </div>
            <div>
              <h2 className=' text-center border py-5 bg-green-300'>Assignment</h2>
              <div className=' grid grid-cols-3 border text-center bg-yellow-200'>
                <p className=' border-r py-2'>C103.1</p>
                <p className=' border-r py-2'>C103.2</p>
                <p className=' py-2'>Total</p>
              </div>
              <div className=' grid grid-cols-3 border text-center bg-purple-300'>
                <p className=' border-r py-1'>{assignment1 == 0 ? 0 : assignment1}</p>
                <p className=' border-r py-1'>{assignment2 == 0 ? 0 : assignment2}</p>
                <p className=' py-1'>{(assignment1 + assignment2) == 0 ? 0 : (Number(assignment1) + Number(assignment2))}</p>
              </div>
            </div>
          </div>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {

              const marks = studentMarks.find(mark => mark.id === student._id) || {};
              const assignmentMarks = studentAssignmentMarks.find(mark => mark.id === student._id) || {};

              return (
                <div key={student._id} className="border w-300 lg:w-full  grid grid-cols-[0.5fr_2fr_2fr_2fr_2fr] overflow-auto">
                  <h3 className=' border-r pl-4 py-1'>{filteredStudents.indexOf(student) + 1}</h3>
                  <h3 className=' border-r pl-4 py-1'>{student.rollNumber}</h3>
                  <h3 className=" border-r pl-4 py-1">{student.name}</h3>
                  <div className=' grid grid-cols-3 border-r text-center'>
                    <input value={marks.mark1 || ""} onChange={(e) => handleMarkChange(student._id, 'mark1', e.target.value)} className=' border my-2 mx-5 rounded text-center' type="number" />
                    <input value={marks.mark2 || ""} onChange={(e) => handleMarkChange(student._id, 'mark2', e.target.value)} className=' border my-2 mx-5 rounded text-center' type="number" />
                    <input
                      value={marks.total || ""}
                      className=' border my-2 mx-5 rounded text-center bg-gray-100'
                      type="text"
                      readOnly
                    />
                  </div>
                  <div className=' grid grid-cols-3 border-r text-center'>
                    <input value={assignmentMarks.assignmentMark1 || ""} onChange={(e) => handleAssignmentChange(student._id, 'assignmentMark1', e.target.value)} className=' border my-2 mx-5 rounded text-center' type="number" />
                    <input value={assignmentMarks.assignmentMark2 || ""} onChange={(e) => handleAssignmentChange(student._id, 'assignmentMark2', e.target.value)} className=' border my-2 mx-5 rounded text-center' type="number" />
                    <input value={assignmentMarks.assignmentTotal || ""} readOnly className=' border my-2 mx-5 rounded text-center bg-gray-100' type='text' />
                  </div>
                </div>
              )
            })
          ) : (
            <p className=' w-300 lg:w-full  border text-center  py-3'>No students found.</p>
          )}
        </div>
        <div className=' flex justify-end'>
          <button onClick={handleCalculate} className=' bg-green-700 py-1 px-10 hover:scale-105 transition-all duration-300 cursor-pointer mr-5 mt-10 font-semibold text-lg  rounded my-2  text-white '>Calculate</button>
        </div>

        <div className=' mt-20 overflow-auto '>

          <div className=' border w-200 lg:w-full grid grid-cols-[7fr_1fr_1fr_1fr_1fr_1fr_1fr]'>
            <h2 className=' border-r  py-2 px-2'> Total Student</h2>
            <h2 className=' border-r  text-center py-2 px-2'>{filteredStudents.length}</h2>
          </div>

          <div className=' border w-200 lg:w-full grid grid-cols-[7fr_1fr_1fr_1fr_1fr_1fr_1fr]'>
            <h2 className=' border-r py-2 px-2'>Target (%)</h2>
            <h2 className=' border-r py-2 px-2'><input className=' text-center border rounded w-full h-fit' type="number" value={target} onChange={(e)=> setTarget(e.target.value)} /> </h2>
          </div>

          <div className=' border w-200 lg:w-full grid grid-cols-[7fr_1fr_1fr_1fr_1fr_1fr_1fr]'>
            <h2 className=' border-r py-2 px-2'>Target Value</h2>
            {(() => { const { a, b } = getActiveCOs(); return (
              <>
                <h2 className=' border-r text-center py-2 px-2'>{(((a || 0) / 100) * target).toFixed(1)}</h2>
                <h2 className=' border-r text-center py-2 px-2'>{(((b || 0) / 100) * target).toFixed(1)}</h2>
                <h2 className=' border-r text-center py-2 px-2'></h2>
                <h2 className=' border-r text-center py-2 px-2'>{(((assignment1 || 0) / 100) * target).toFixed(1)}</h2>
                <h2 className=' border-r text-center py-2 px-2'>{(((assignment2 || 0) / 100) * target).toFixed(1)}</h2>
              </>
            ); })()}
          </div>
          <div className='border w-200 lg:w-full grid grid-cols-[7fr_1fr_1fr_1fr_1fr_1fr_1fr]'>
            <h2 className=' border-r py-2 px-2'>Attainment %</h2>
            <h2 className='border-r text-center py-2 px-2'>{attainment.co1}</h2>
            <h2 className='border-r text-center py-2 px-2'>{attainment.co2}</h2>
            <h2 className='border-r text-center py-2 px-2'></h2>
            <h2 className='border-r text-center py-2 px-2'>{attainmentAssignments.assign1}</h2>
            <h2 className='border-r text-center py-2 px-2'>{attainmentAssignments.assign2}</h2>
          </div>

          <div className='border w-200 lg:w-full grid grid-cols-[7fr_1fr_1fr_1fr_1fr_1fr_1fr]'>
            <h2 className=' border-r py-2 px-2'>Attainment </h2>
            <h2 className='border-r text-center py-2 px-2'>{attainment.co1Value}</h2>
            <h2 className='border-r text-center py-2 px-2'>{attainment.co2Value}</h2>
            <h2 className='border-r text-center py-2 px-2'></h2>
            <h2 className='border-r text-center py-2 px-2'>{attainmentAssignments.assign1Value}</h2>
            <h2 className='border-r text-center py-2 px-2'>{attainmentAssignments.assign2Value}</h2>
          </div>
        </div>


        <div className=' mt-20 overflow-auto lg:mx-50 border rounded'>
          <div className=' lg:w-full grid grid-cols-5 bg-yellow-600'>
            <h2 className=" border-r text-center py-1">CO</h2>
            <h2 className=" border-r text-center py-1">Attainment- PT</h2>
            <h2 className=" border-r text-center py-1">Attainment Level</h2>
            <h2 className=" border-r text-center py-1">Attainment</h2>
            <h2 className="  text-center py-1">Attainment Level</h2>
          </div>
          <div className=' lg:w-full grid grid-cols-5 border-b'>
            <h2 className=" border-r text-center py-1">CO103.1</h2>
            <h2 className=" border-r text-center py-1">{attainment.co1}</h2>
            <h2 className=" border-r text-center py-1">{levelco1}</h2>
            <h2 className=" border-r text-center py-1">{attainmentAssignments.assign1}</h2>
            <h2 className="  text-center py-1">{levelAssignment1}</h2>
          </div>
          <div className='  lg:w-full grid grid-cols-5 '>
            <h2 className=" border-r text-center py-1">CO103.2</h2>
            <h2 className=" border-r text-center py-1">{attainment.co2}</h2>
            <h2 className=" border-r text-center py-1">{levelco2}</h2>
            <h2 className=" border-r text-center py-1">{attainmentAssignments.assign2}</h2>
            <h2 className="  text-center py-1">{levelAssignment2}</h2>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleSaveReport}
        className="bg-blue-700 py-2 px-6 text-white rounded mt-10 hover:scale-105 transition-all duration-300"
      >
        Save Report
      </button>
{/* 
      {Array.isArray(reportData) && reportData.length > 0 && (
        <div dangerouslySetInnerHTML={{ __html: reportData[0].report_html }} />
      )} */}

      <div>

      </div>
    </div>
  )
}

export default Internal