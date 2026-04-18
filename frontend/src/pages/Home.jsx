import React from 'react'
import { AppData } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {logoutUser} = AppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();      
    navigate("/login");     
  };

  return (
    <div className='flex w-25 m-auto mt-40' >
      <button className='bg-red-500 text-white p-2 rounded-md' onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default Home
