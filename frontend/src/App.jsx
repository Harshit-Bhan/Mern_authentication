import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Verify from './pages/Verify'
import VerifyOtp from './pages/VerifyOtp'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/verify-otp" element={<VerifyOtp/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  </>
}

export default App
