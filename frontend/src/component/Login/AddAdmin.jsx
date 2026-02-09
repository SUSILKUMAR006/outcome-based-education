import React, { useState } from 'react'
import Navbar from '../Navbar'
import { assets } from '../../assets/assets'
import axios from 'axios';

const AddAdmin = () => {
    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    const url = 'http://localhost:4000';


    const AddAdminHandler  = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/users/api/AddAdmin`, {
                name: name,
                email: email,
                password: password
            })
            console.log(response.data);
            if(response.data.success){
                alert("Admin Added Successfully");
                setName('');
                setEmail('');
                setPassword('');
            } else {
                alert("Failed to add admin: " + response.data.message);
            }
        } catch (error) {
            console.error("Adding admin failed", error);
            alert("Error: " + error.message);
        }
    }


  return (
    <div className='bg-gradient-to-br from-orange-300 to-red-300 h-screen pb-10 px-3 lg:px-15 pt-2'>
        <Navbar />

        <div className=' flex justify-center items-center h-[90vh]'>
            <div className=' bg-white rounded shadow-lg px-10 pt-5 pb-10 lg:w-[400px] w-full'>
                <img className='h-16 object-contain' src={assets.college_logo} alt="" srcSet="" />
                <h1 className=' text-xl font-semibold text-center mt-5'>Add Admin</h1>
                <form onSubmit={AddAdminHandler} className=' flex flex-col justify-center items-center gap-5 mt-10 '>
                    <input value={name} onChange={(e)=> setName(e.target.value)} type="text" className=' border border-gray-500 w-full h-10  rounded px-5 py-1' placeholder='Enter the Admin Name' name="" id="name"  required/>
                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" className=' border border-gray-500 w-full  h-10  rounded px-5 py-1' placeholder='Enter the Admin Email' name="" id="email" required />
                    <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" className=' border border-gray-500 w-full h-10  rounded px-5 py-1' placeholder='Enter the Admin Password'  required />
                    <button type='submit' className=' bg-gradient-to-br from-green-700 to-green-500 mt-3 py-2 rounded shadow mx-auto px-10  text-white hover:shadow-lg cursor-pointer'>Add Admin</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddAdmin