import { useEffect, useState } from "react"
import { api, axiosError } from "../lib/axios"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import Layout from "../components/Layout"
import { ExternalLink, MoveLeft, X } from "lucide-react"
import LogoLoadingScreen from "../components/Loading"

import type { questions } from "../types/questions"
import type { AxiosResponse } from "axios"
import type { attempts } from "../types/attempts"

const History = () => {
    const [data, setData] = useState<questions | null>(null)
    const [display, setDisplay] = useState(false)
    const [attempt, setAttempt] = useState<attempts | null>(null)

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

    useEffect(()=>{
        fetchData()
    }, [])
    if (data === null) return <LogoLoadingScreen />;
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

    const question = data.questions
    const attempts = attempt?.response
  return (
      <div className="bg-[#16171d] text-white px-4 py-8 md:p-10 lg:p-15 pt-28 max-w-full min-h-screen flex flex-col items-center">
        <Layout fetchData={fetchData}/>
        <div className="w-full max-w-5xl bg-[#1e1f25] mt-6 rounded-3xl p-4 md:p-10">
            <Link to="/dashboard">
                <Badge className="bg-[#1e1f25] p-3 m-3 mt-0 mb-5 border-white border"><MoveLeft /> Back</Badge>
            </Link>
            <h1 className="text-2xl font-bold m-3 mt-0"> All Attempts</h1>
            {!question || question.length === 0 ? (
                <div className="p-10 flex flex-col justify-center items-center">
                    <p className="text-gray-400 m-5">
                        No Questions Found
                    </p>
                    <img src="/noRecord.webp" alt="No Record" className="max-h-full h-50 w-50"/>
                </div>
            ) : (
                question?.map((list)=>(
                    <div key={list._id}>
                        <div key={list._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 m-2 my-4 bg-[#2b2c35] rounded-xl gap-3">
                            <div className="flex flex-col items-start w-full sm:w-1/2">
                                <h1 className="text-md md:text-lg font-medium">{list.questionNo}. {list.name} </h1>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-1/2 gap-3 flex-wrap">
                                <Badge className={`border ${list.tag == "easy"? "bg-green-950 text-green-300 border-green-300": list.tag == "medium"? "bg-orange-900 text-orange-300 border border-orange-300": "bg-red-950 text-red-300 border-red-300"}`}>{list.tag}</Badge>
                                <a
                                    href={/^(https?:)?\/\//i.test(list.link) ? list.link : `https://${list.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="secondary" size="sm" className="flex items-center gap-1">Link <ExternalLink className="h-3 w-3" /></Button>
                                </a>
                                <Button onClick={() => handleClick(list._id)} variant="secondary" size="sm">See attempts</Button>
                            </div>
                        </div>
                    </div>
                )))}
        </div>

        <div className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4 ${display? "block" : "hidden"}`}>
            <div className="w-full max-w-2xl bg-[#1e1f25] border border-white/10 rounded-3xl p-6 md:p-8 relative max-h-[85vh] overflow-y-auto">
                <button onClick={() => {setDisplay(false); setAttempt(null)}} className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white hover:bg-gray-200 transition rounded-full flex justify-center items-center">
                        <X className="text-black h-4 w-4 md:h-5 md:w-5" />
                    </div>
                </button>
                <h2 className="text-xl font-bold mb-6 text-white">Attempt History</h2>
                <div className="space-y-3">
                    {attempts?.map((list)=>(
                        <div key={list._id} className="flex justify-between items-center p-4 bg-[#2b2c35] rounded-xl text-sm md:text-base gap-3">
                            <div className="flex flex-col items-start">
                                <span className="text-gray-300 font-medium">{formatTime(list.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-sm ${list.hint ? "text-yellow-400": "text-gray-500" }`}>
                                    {list.hint ? "Hint Used" : "No Hint"}
                                </span>
                                <span className="font-mono text-gray-300">{Math.floor(list.time / 60)}m {Math.floor(list.time % 60)}s</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </div>
  )
}

export default History