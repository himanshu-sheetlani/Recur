import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import toast from "react-hot-toast"
import type { questions } from "../types/questions"
import type { AxiosResponse } from "axios"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import Navbar from "../components/Navbar"
import { ExternalLink, MoveLeft } from "lucide-react"


const History = () => {
    const [data, setData] = useState<questions | null>(null)
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response: AxiosResponse<questions> = await api.get("/dashboard/question")
                setData(response.data)
            }
            catch(e){
                toast.error(e as string)
            }
        }
        fetchData()
    }, [])

    const question = data?.questions
  return (
      <div className="bg-[#16171d] text-white p-15 max-w-screen min-h-screen flex flex-col items-center">
        <Navbar/>
        <div className="w-full h-fit bg-[#1e1f25] mt-10 rounded-3xl p-10">
            <Link to="/dashboard">
                <Badge className="bg-[#2b2c35] p-3 m-3 mt-0 mb-5 border-white border"><MoveLeft /> Back</Badge>
            </Link>
            <h1 className="text-2xl font-bold m-3 mt-0"> All Attempts</h1>
            {question?.map((list)=>(
                <div key={list._id}>
                    <div key={list._id} className="flex justify-between items-center p-5 m-2 my-4 bg-[#2b2c35] rounded-xl">
                    <div className="flex flex-col items-start w-1/2">
                        <h1 className="text-lg">{list.questionNo}. {list.name} </h1>
                        
                    </div>
                    {/* <p className={`${list.hint ? "text-white": "text-gray-600" }`} >{list.hint ?"Hint Used":"No Hint"}</p> */}
                    <div className="w-1/6 text-center">
                        <Badge className={`border ${list.tag == "easy"? "bg-green-950 text-green-300 border-green-300": list.tag ==     "medium"? "bg-orange-900 text-orange-300 border border-orange-300": "bg-red-950 text-red-300 border-red-300"}   `}>{list.tag}</Badge>
                    </div>
                    <div className="w-1/6 text-center">
                        <Link to={list.link}>
                            <Button variant="secondary">Link <ExternalLink /></Button>
                        </Link>
                    </div>
                    <div className="w-1/6 text-center">
                        <button>
                            <Button variant="secondary">See attempts</Button>
                        </button>
                    </div>
                </div>
                </div>
            ))}
        </div>

        

    </div>
  )
}

export default History