import React, { useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'
import axios from 'axios'

const AddSubject = () => {
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const url = 'http://localhost:4000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const payload = { subjectName, subjectCode }
      const res = await axios.post(`${url}/subjects/add`, payload)
      if(res.status === 200){
        alert('Subject added')
        setSubjectName('')
        setSubjectCode('')
      }
    }catch(err){
      console.error('Add subject error', err)
      alert('Failed to add subject')
    }
  }

  return (
    <div className='bg-blue-200 h-screen  pb-10 px-3 lg:px-15 pt-2'>
      <Navbar />
      <div className=' bg-white pt-5 pb-10 rounded px-10 mt-5' >
        <h1 className='font-semibold '>Subject information</h1>
        <div className=' flex justify-center mt-10'>
          <img src={assets.college_logo} className=' object-contain' alt="" srcSet="" />
        </div>
        <div className=' mt-5 flex flex-col items-center'>
          <h1 className=' text-center'>Add Subject</h1>
          <form onSubmit={handleSubmit} className='  flex flex-col lg:w-[30%]  bg-gradient-to-br from-blue-200 to-purple-200 px-5 py-10 rounded shadow-lg mt-5'>
            <input value={subjectName} onChange={(e)=>setSubjectName(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-5 outline-0 bg-white' placeholder='Subject Name' />
            <input value={subjectCode} onChange={(e)=>setSubjectCode(e.target.value)} type="text" className='border border-gray-400  w-full mb-2 mt-5 rounded h-10 p-5 outline-0 bg-white' placeholder='Subject Code' />
            <button type='submit' className=' bg-green-600 px-10 py-2 w-fit mx-auto mt-5'>Add Subject</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSubject