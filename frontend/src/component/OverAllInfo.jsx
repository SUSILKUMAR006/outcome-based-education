import React from 'react'

const OverAllInfo = () => {
  return (
    <div className=' my-10 bg-white px-10 py-5 rounded shadow-lg'>
        <div>
            <h1 className=' text-lg font-semibold mb-2'>Quick Start Guide</h1>
            <ol>
                <li className=' text-gray-700 py-1 cursor-pointer'><span className=' text-blue-500'>1. </span>Select department and subject to begin assessment</li>
                <li className=' text-gray-700 py-1 cursor-pointer'><span className=' text-blue-500'>2. </span>Enter Internal Assessment marks (IAT 1, 2, 3) for each student</li>
                <li className=' text-gray-700 py-1 cursor-pointer'><span className=' text-blue-500'>3. </span>Add End Semester exam marks across all Course Outcomes</li>
                <li className=' text-gray-700 py-1 cursor-pointer'><span className=' text-blue-500'>4. </span>Generate Final Attainment reports with automatic calculations</li>
                <li className=' text-gray-700 py-1 cursor-pointer'><span className=' text-blue-500'>5. </span>Create CO-PO mapping to align with program outcomes</li>
            </ol>
        </div>
    </div>
  )
}

export default OverAllInfo