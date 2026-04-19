import React, { useEffect, useRef, useState } from 'react'
import { server } from '../main';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';

const Verify = () => {
  
  const [successMessage , setSuccessMessage] = useState("");
  const [errorMessage , setErrorMessage] = useState("");

  const params = useParams();
  const hasVerifiedRef = useRef(false);

  const [loading, setLoading] = useState(true);

  async function verifyUser(token) {
    try {
      const { data } = await axios.post(`${server}/api/v1/verify/${token}`);
      
      setErrorMessage("");              // clear error
      setSuccessMessage(data.message);  // set success

    } catch (error) {
      
      setSuccessMessage("");            // clear success
      setErrorMessage(
        error?.response?.data?.message || "Verification failed"
      );

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!params.token) {
      setErrorMessage("Verification token is missing");
      setLoading(false);
      return;
    }

    if (hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;
    verifyUser(params.token)
  },[params.token]);

  return (
    <>
      {loading ? (<Loading/>) : (
    <div className='w-50 m-auto mt-48'>
      {successMessage && <p className='text-green-500 text-2xl'>
        {successMessage}
      </p>}
      {errorMessage && <p className='text-red-500 text-2xl'>
        {errorMessage}
      </p>}

    </div>
      )}
    </>
  )
}

export default Verify
