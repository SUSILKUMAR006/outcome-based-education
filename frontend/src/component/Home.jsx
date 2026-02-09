import React from 'react'
import { useNavigate } from 'react-router-dom'
const Home = () => {

    const navigate = useNavigate();
  return (
    <div className=' my-10 bg-white px-5 lg:px-10 py-5 rounded shadow-lg' >
        <div>
            <h1 className=' text-xl lg:text-2xl font-bold '>Welcome to OBE Portal</h1>
            <p className=' text-gray-600 '>Manage course outcomes, track student performance, and generate NBA-compliant attainment reports</p>
        </div>

        <div className=' grid place-self-center gap-10 grid-cols-1  md:grid-cols-2 lg:grid-cols-4 my-5 lg:my-20'>
            <div onClick={()=>navigate("/internal")} className=' bg-white shadow-lg  rounded md:w-[300px] md:h-[280px] relative cursor-pointer scale-100 hover:shadow-2xl hover:scale-110 duration-300'>
            <div className=' bg-blue-500 flex rounded-t justify-center'>
                <div className=' w-20 h-20 bg-blue-200 rounded-full relative top-10 flex justify-center items-center text-blue-600 text-5xl font-semibold'>
                    <i className='bx bx-book-alt'></i>
                </div>
            </div>
            <div className='my-15'>
                    <h1 className=' text-lg font-medium text-center'>Internal Assessment</h1>
                    <p className='text-center text-gray-500'>Enter IAT marks, assignments and calculate CO-wise attainment</p>
            </div>
        </div>

        <div onClick={()=> navigate("/end-semester")} className=' bg-white shadow-lg rounded md:w-[300px] md:h-[280px] relative cursor-pointer scale-100 hover:shadow-2xl hover:scale-110 duration-300'>
            <div className=' bg-green-600 rounded-t flex justify-center'>
                <div className=' w-20 h-20 bg-green-200 rounded-full relative top-10 flex justify-center items-center text-green-600 text-5xl font-semibold'>
                    <i className='bx bx-book-open'></i>
                </div>
            </div>
            <div className='my-15'>
                    <h1 className=' text-lg font-medium text-center'>End Semester</h1>
                    <p className='text-center text-gray-500'>Manage end semester exams and CO-Wise performance</p>
            </div>
        </div>


        <div onClick={()=> navigate("/Final-Attainment")} className=' rounded bg-white shadow-lg md:w-[300px] md:h-[280px] relative cursor-pointer scale-100 hover:shadow-2xl hover:scale-110 duration-300'>
            <div className=' rounded-t bg-blue-500 flex justify-center'>
                <div className=' w-20 h-20 bg-blue-200 rounded-full relative top-10 flex justify-center items-center text-blue-600 text-5xl font-semibold'>
                    <i className='bx bxs-book-reader' ></i>
                </div>
            </div>
            <div className='my-15'>
                    <h1 className=' text-lg font-medium text-center'>Final Attainment</h1>
                    <p className='text-center text-gray-500'>Calculate final attainment combining direct and indirect measure</p>
            </div>
        </div>


        <div onClick={()=>navigate("/Co-Po-Mapping")} className=' rounded bg-white shadow-lg md:w-[300px] md:h-[280px] relative cursor-pointer scale-100 hover:shadow-2xl hover:scale-110 duration-300'>
            <div className=' rounded-t bg-orange-400 flex justify-center'>
                <div className=' w-20 h-20 bg-orange-200 rounded-full relative top-10 flex justify-center items-center text-orange-600 text-5xl font-semibold'>
                    <i className='bx bxs-bar-chart-alt-2'></i>
                </div>
            </div>
            <div className='my-15'>
                    <h1 className=' text-lg font-medium text-center'>CO-PO Mapping</h1>
                    <p className='text-center text-gray-500'>Map course outcomes to program outcomes</p>
            </div>
        </div>
        </div>

        <div className=' flex flex-wrap gap-5 mb-10 justify-center'>
            <div onClick={()=> navigate("/report")} className=' flex bg-[#3D95F4] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className='bx bxs-report text-3xl'></i></span>
                    <h2 className=' font-semibold '>See All Report</h2>
                </div>
            </div>
            <div onClick={()=>navigate("/Add-Student")} className=' flex bg-[#fb7265] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className='bx bxs-group text-3xl'></i></span>
                    <h2 className=' font-semibold '>Add Students</h2>
                </div>
            </div>
            <div onClick={()=>navigate('/Add-Admin')} className=' flex bg-[#5e62bb] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className='text-3xl bx bxs-user'></i></span>
                    <h2 className=' font-semibold '>Add Admins</h2>
                </div>
            </div>
            <div onClick={()=> navigate("/Add-Subject")} className=' flex bg-[#fbbc3a] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className='text-3xl bx bxs-book-heart'></i></span>
                    <h2 className=' font-semibold '>Add Subjects</h2>
                </div>
            </div>
            <div onClick={()=> navigate("/Add-department")} className=' flex bg-[#2e61a0] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className='text-3xl bx bxs-school'></i></span>
                    <h2 className='  font-semibold '>Add Department</h2>
                </div>
            </div>
            <div onClick={()=> navigate("/survey")} className=' flex bg-[#34B97A] text-white py-3 px-5 rounded hover:scale-104 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-400'>
                <div className=' flex  gap-3 items-center'>
                    <span><i className=' text-3xl bx bx-task'></i></span>
                    <h2 className=' font-semibold '>Take Survey <br/>(Subject Wise)</h2>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home