import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import VerifyOtp from './pages/VerifyOtp'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'
import { AppData } from './context/AppContext'
import Loading from './Loading'

const App = () => {
  const { isAuth, loading } = AppData()

  return <>
   {loading ? (
    <Loading />
   ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" replace /> } />
        <Route path="/login" element={isAuth ? <Home/> : <Login />} />
        <Route path="/register" element={isAuth ? <Home/> : <Register />} />
        <Route path="/verify/:token" element={isAuth ? <Home/> : <Verify />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
   )}
  </>
}

export default App
