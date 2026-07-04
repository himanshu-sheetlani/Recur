import { useState } from "react";
import { Calendar } from "../ui/calendar";


const SideBar = () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
        <div className="w-full bg-[#1e1f25] rounded-3xl p-6 md:p-10 flex flex-col items-center">
              <div className="w-full max-w-sm flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg text-white bg-[#1e1f25] w-full h-auto"
                  />
              </div>
        </div> 
    )
}

export default SideBar
