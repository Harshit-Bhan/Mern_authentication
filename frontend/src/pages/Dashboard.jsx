import React, { useEffect, useState } from 'react'
import { server } from '../main';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [content,setContent] = useState("")
  async function fetchAdminData() {
    try {
      const {data} = await axios.get(`${server}/api/v1/admin`,{
        withCredentials: true,
      });
      setContent(data.message);

    } catch (error) {
      toast.error("Error fetching admin data:", error);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);
  return <>
    {content && <div>{content}</div>}
  </>;
}

export default Dashboard
