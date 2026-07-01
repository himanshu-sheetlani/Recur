import { useEffect, useState } from "react"
import { api, axiosError } from "../lib/axios"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import Navbar from "../components/Navbar"
import { ExternalLink, MoveLeft, X } from "lucide-react"

import type { questions } from "../types/questions"
import type { AxiosResponse } from "axios"
import type { attempts } from "../types/attempts"

const History = () => {
    const [data, setData] = useState<questions | null>(null)
    const [display, setDisplay] = useState(false)
    const [attempt, setAttempt] = useState<attempts | null>(null)

    useEffect(()=>{
        const fetchData = async()=>{
            try{
                const response: AxiosResponse<questions> = await api.get("/dashboard/question")
                setData(response.data)
            }
            catch(e){
                const err=axiosError(e)
                toast.error(err);
            }
        }
        fetchData()
    }, [])

    const handleClick = async(id: string) =>{
        setDisplay(true)
        try{
            const response: AxiosResponse<attempts> = await api.get(`/dashboard/question/${id}`)
            setAttempt(response.data)
        }
        catch(e){
            const err=axiosError(e)
            toast.error(err);
        }
    }

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }   catch {
            return "Invalid Date";
        }
    };

    const question = data?.questions
    const attempts = attempt?.response
  return (
      <div className="bg-[#16171d] text-white p-15 max-w-screen min-h-screen flex flex-col items-center">
        <Navbar/>
        <div className="w-full h-fit bg-[#1e1f25] mt-10 rounded-3xl p-10">
            <Link to="/dashboard">
                <Badge className="bg-[#1e1f25] p-3 m-3 mt-0 mb-5 border-white border"><MoveLeft /> Back</Badge>
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
                        <button onClick={() => handleClick(list._id)}>
                            <Button variant="secondary">See attempts</Button>
                        </button>
                    </div>
                </div>
                </div>
            ))}
        </div>

        <div className={`w-screen h-screen bg-[#1e1f25]/5 top-0 backdrop-blur-2xl p-50 ${display? "absolute" : "hidden"}`}>
            <button onClick={() => {setDisplay(false)}}>
                <div className="w-10 h-10 bg-white rounded-full absolute top-15 right-15 flex justify-center items-center   ">
                    <X className="text-black"/>
                </div>
            </button>
            <div className="w-full h-full rounded-3xl bg-[#1e1f25] p-5">
                {attempts?.map((list)=>(
                    <div key={list._id}>
                        <div key={list._id} className="flex justify-between items-center p-5 m-2 my-4 bg-[#2b2c35] rounded-xl">
                        <div className="flex flex-col items-start w-1/2">
                            <h1 className="text-lg">{formatTime(list.createdAt)} </h1>

                        </div>
                        <p className={`${list.hint ? "text-white": "text-gray-600" }`} >{list.hint ?"Hint Used":"No Hint"}</p> 
                        <p>{Math.floor(list.time / 60)}m {Math.floor(list.time % 60)}s</p> 
                        
                    </div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default History