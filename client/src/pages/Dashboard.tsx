import toast from "react-hot-toast"
import { Button } from "../components/ui/button"
import { api } from "../lib/axios"
import { useNavigate } from "react-router-dom"
import type { AxiosResponse } from "axios"

interface APIRes {
  msg: string;
} 

const Dashboard = () => {
  const navigate = useNavigate()
  const logout = async() =>{
    try{
      const response: AxiosResponse<APIRes> = await api.post("/auth/logout")
      toast.success(response.data.msg);
      navigate('/login')
    }
    catch(e){
      console.log(e)
      // toast.error(e as string)
    }
  }
  return (
    <div className="bg-[#16171d] text-white max-w-screen h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold m-10">
            Dashboard
        </h1>
        <Button className="p-5 m-5 text-lg" variant='destructive' onClick={logout}>Logout</Button>
    </div>
  )
}

export default Dashboard