import React from 'react'
import { AppData } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const {logoutUser,user} = AppData();
  const navigate = useNavigate();



  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className='flex w-25 m-auto mt-40' >
      <button className='bg-red-500 text-white p-2 rounded-md' onClick={handleLogout}>
        Logout
      </button>
      {
        user && user.role === 'admin' && (
          <Link className='bg-purple-500 text-white p-2 rounded-md' to="/dashboard">
            Dashboard
          </Link>
        )
      }
    </div>
  )
}

export default Home
