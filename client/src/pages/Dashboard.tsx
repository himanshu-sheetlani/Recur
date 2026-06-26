import toast from "react-hot-toast"
import { api } from "../lib/axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import type { AxiosResponse } from "axios"
import Navbar from '../components/Navbar'
import Loading from "../components/Loading"
import Main from "../components/dashboard/Main"

import type { APIRes, stats } from "../types/stats"
import SideBar from "../components/dashboard/SideBar"

const Dashboard = () => {
  const [data, setData] = useState<stats | null>(null)
  const navigate = useNavigate()
  const logout = async() =>{
    try{
      const response: AxiosResponse<APIRes> = await api.post("/auth/logout")
      toast.success(response.data.msg);
      navigate('/login')
    }
    catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response: AxiosResponse<stats> = await api.get("/dashboard/stats")
        console.log(response.data)
        setData(response.data)
      }
      catch (e){
        console.log(e)
      }
    };
    fetchData();
  }, [])

  if (!data) {
  return <Loading/>;
  }
  

  return (
    <div className="bg-[#16171d] text-white max-w-screen min-h-screen flex justify-center items-center flex-wrap px-15 pt-25">
      <Navbar/>
      <div className="text-center w-3/4 h-full flex justify-center flex-col p-10 pt-0 pl-0 pb-0">
        <Main data = {data}/>
      </div>
      <SideBar/>
        {/* <h1 className="text-4xl font-bold m-10">
            Dashboard
        </h1>
        <Button className="p-5 m-5 text-lg" variant='destructive' onClick={logout}>Logout</Button> */}
    </div>
  )
}

export default Dashboard