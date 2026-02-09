import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../../assets/assets';

const CoPoMapping = () => {
  const url = 'http://localhost:4000';
  const [subjects, setSubject] = useState([]);
  const [student, setStudent] = useState([]);
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState('');
  // const [attainmentData, setAttainmentData] = useState([]);

  const openAsheet = (subjectName) => {
    navigate(
      `/Co-Po-Sheet?batch=${encodeURIComponent(selectedBatch)}&subject=${encodeURIComponent(subjectName)}`
    );
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${url}/students/getAll`);
        setStudent(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    const getAllSubjects = async () => {
      try {
        const response = await axios.get(`${url}/subjects/getAll`);
        setSubject(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    

    getAllSubjects();
    fetchStudentData();
    // fetchAttainmentData();
  }, []);


  // Filter attainment data based on selected batch


  return (
    <div className='bg-blue-100 pb-10 px-3 lg:px-15 pt-2 min-h-screen'>
      <Navbar />
      <div className="my-10 bg-white px-10 py-5 rounded shadow-lg">
        <div className="flex my-2">
          <img className="h-18 lg:h-22 px-5 py-3 mx-auto" src={assets.college_logo} alt="logo" />
        </div>

        <h1 className="text-xl lg:text-2xl font-bold text-center">CO, PO, PSO MAPPING & ATTAINMENT</h1>
        <p className="text-gray-600 text-center">
          Manage Course mappings and view Final Attainment details
        </p>

        <div className='mt-10'>
          <h1 className="lg:mx-10 text-xl font-semibold">Select Batch</h1>
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} name="" id="" className="mt-3 lg:mx-10 px-3 py-2 border rounded shadow-sm w-64">
            <option value="" className=''>Select the Batch</option>
            {
              [...new Set(student.map(stu => stu.batch))].map((batch, index) => (
                <option key={index} value={batch}> {batch}</option>
              ))
            }
          </select>
        </div>

        <div className='mt-8'>
          <h1 className="lg:mx-10 text-xl font-semibold">Subjects (Click to Map)</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:mx-10 mt-3'>
            {subjects.map((sub, index) => (
              <div
                key={index}
                onClick={() => selectedBatch ? openAsheet(sub.subjectName) : alert('Please select a batch first')}
                className={`px-5 py-3 rounded shadow-md transition
                                    ${selectedBatch
                    ? 'bg-gradient-to-br from-orange-200 to-red-200 cursor-pointer hover:shadow-lg hover:scale-105'
                    : 'bg-gray-200 cursor-not-allowed opacity-70'}`}
              >
                <span className='font-bold'>{sub.subjectCode}</span> - {sub.subjectName}
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </div>
  )
}

export default CoPoMapping