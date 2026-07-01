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
        <div className="h-1/2 w-full mt-5 bg-[#1e1f25] p-5 rounded-3xl">
            <div className="flex p-5 justify-between">
                <h1 className="text-2xl font-bold">Recently Solved Questions</h1>
                <Link to="/history" className="cursor-pointer">
                    <Button variant="default" className="text-sm p-3">View All <ArrowRight/> </Button>
                </Link>
            </div>
            {recentAttempt.map((list)=>(
                <div key={list._id} className="flex justify-between items-center p-5 m-2 bg-[#2b2c35] rounded-xl">
                    <div className="flex flex-col items-start w-1/2">
                        <h1 className="text-lg">{list.questionId.questionNo}. {list.questionId.name}</h1>
                        <p className="ml-5 text-gray-400 text-sm">{Math.floor(list.time / 60)}:{Math.floor(list.time % 60)} mins</p>
                    </div>
                    <p className={`${list.hint ? "text-white": "text-gray-600" }`} >{list.hint ?"Hint Used":"No Hint"}</p>
                    <Badge className={`border ${list.questionId.tag == "easy"? "bg-green-950 text-green-300 border-green-300": list.questionId.tag == "medium"? "bg-orange-900 text-orange-300 border border-orange-300": "bg-red-950 text-red-300 border-red-300"}`}>{list.questionId.tag}</Badge>
                    <Link to={list.questionId.link}>
                        <Button variant="secondary">Link</Button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default Recent