import React, { useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'
import axios from 'axios'

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState('')
  const [headOfDepartment, setHeadOfDepartment] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const url = 'http://localhost:4000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const payload = { departmentName, headOfDepartment, contactEmail }
      const res = await axios.post(`${url}/departments/add`, payload)
      if(res.status === 201){
        alert('Department added')
        setDepartmentName('')
        setHeadOfDepartment('')
        setContactEmail('')
      }
    }catch(err){
      console.error('Add department error', err)
      alert('Failed to add department')
    }
  }

  return (
    <div className='bg-blue-200 lg:h-screen pb-10 px-3 lg:px-15 pt-2'>
      <Navbar />
      <div className=' bg-white pt-5 pb-10 px-10 mt-5 ' >
        <h1 className='font-semibold '>Department information</h1>
        <div className=' flex justify-center mt-10'>
          <img src={assets.college_logo} className='object-contain' alt="" srcSet="" />
        </div>
        <div className=' mt-5 flex flex-col items-center'>
          <h1 className=' text-center'>Add Department</h1>
          <form onSubmit={handleSubmit} className='  flex flex-col lg:w-[30%]  bg-gradient-to-br from-blue-200 to-purple-200 p-5 rounded shadow-lg mt-5'>
            <input value={departmentName} onChange={(e)=>setDepartmentName(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-5 outline-0 bg-white' placeholder='Department Name' />
            <input value={headOfDepartment} onChange={(e)=>setHeadOfDepartment(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-5 outline-0 bg-white' placeholder='Head of Department' />
            <input value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} type="email" className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-5 outline-0 bg-white' placeholder='Contact Email' />
            <button type='submit' className=' rounded bg-green-600 px-10 py-2 w-fit mx-auto mt-5'>Add Department</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddDepartment
