import { Link } from "react-router-dom"
import type {stats} from "../../types/stats"
import {Badge} from "../ui/badge"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

// userId: string;
// questionId: {
//      questionNo: number,
//      name: string,
//      tag: "easy" | "medium" | "hard",
//      link: string,
// };
// time: number;
// hint: boolean;

const Recent = ({ data }: { data: stats }) => {
    const recentAttempt = data.recentAttempt
    return (
        <div className="w-full mt-5 bg-[#1e1f25] p-4 md:p-5 rounded-3xl">
            <div className="flex p-4 justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold">Recently Solved Questions</h1>
                <Link to="/history" className="cursor-pointer">
                    <Button variant="default" className="text-xs md:text-sm p-3">View All <ArrowRight className="h-4 w-4" /> </Button>
                </Link>
            </div>
            {!recentAttempt || recentAttempt.length == 0 ? (
                <div className="p-10 flex flex-col justify-center items-center">
                    <p className="text-gray-400 m-5">
                        No Recent Attempt Found
                    </p>
                    <img src="/noRecord.webp" alt="No Record" className="max-h-full h-50 w-50"/>
                </div>
            ):(
                recentAttempt.map((list)=>(
                    <div key={list._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 m-2 gap-3 bg-[#2b2c35] rounded-xl">
                        <div className="flex flex-col items-start w-full sm:w-1/2">
                            <h1 className="text-md md:text-lg font-medium">{list.questionId.questionNo}. {list.questionId.name}</h1>
                            <p className="text-gray-400 text-xs md:text-sm">{Math.floor(list.time / 60)}m {Math.floor(list.time % 60)}s</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <p className={`text-sm ${list.hint ? "text-yellow-400": "text-gray-500" }`} >{list.hint ?"Hint Used":"No Hint"}</p>
                            <Badge className={`border ${list.questionId.tag == "easy"? "bg-green-950 text-green-300 border-green-300": list.questionId.tag == "medium"? "bg-orange-900 text-orange-300 border border-orange-300": "bg-red-950 text-red-300 border-red-300"}`}>{list.questionId.tag}</Badge>
                            <a
                                href={/^(https?:)?\/\//i.test(list.questionId.link) ? list.questionId.link : `https://${list.questionId.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="secondary" size="sm">Link</Button>
                            </a>
                        </div>
                    </div>
                )))}
        </div>
    )
}

export default Recent