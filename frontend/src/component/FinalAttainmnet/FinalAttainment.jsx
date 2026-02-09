import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinalAttainment = () => {
  const url = 'http://localhost:4000';
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [student , setStudent] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState('');

  const openAsheet = (subjectName) => {
    navigate(
      `/a-sheet?batch=${encodeURIComponent(selectedBatch)}&subject=${encodeURIComponent(subjectName)}`
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
        setSubjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllSubjects();
    fetchStudentData();

  }, []);

  return (
    <div className="bg-green-200 pb-10 px-5 lg:px-15 pt-2">
      <Navbar />

      <div className="my-10 bg-white px-10 py-5 rounded shadow-lg">
        <div className="flex my-2">
          <img className="h-18 lg:h-22 px-5 py-3 mx-auto" src={assets.college_logo} alt="logo" />
        </div>

        <h1 className="text-xl lg:text-2xl font-bold">Final Attainment</h1>
        <p className="text-gray-600">
          Calculate final attainment combining direct and indirect measure
        </p>

        <h1 className="lg:mx-10 text-xl mt-10">Subjects</h1>

        <select value={selectedBatch} onChange={(e)=>setSelectedBatch(e.target.value)} name="" id="" className="mt-5 lg:mx-10 px-3 py-2 border rounded shadow-sm">
          <option value="" className=''>Select the Batch</option>
          {
           [...new Set(student.map(stu => stu.batch))].map((batch , index) =>(
              <option onChange={()=>setSelectedBatch(batch)} key={index} value={batch}> {batch}</option>
            ))
          }
        </select>

        {subjects.map((sub, index) => (
          <div
            key={index}
            onClick={() => openAsheet(sub.subjectName)}
            className="mt-5 lg:mx-10 bg-gradient-to-br from-orange-200 to-red-200 
                       px-5 py-3 rounded shadow-md hover:shadow-lg 
                       cursor-pointer hover:scale-105 transition"
          >
            {sub.subjectCode} - {sub.subjectName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalAttainment;
