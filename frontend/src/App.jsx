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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuth ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
   )}
  </>
}

export default App
