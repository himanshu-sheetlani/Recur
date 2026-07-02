import { X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface NavbarProps {
  setPopup: Dispatch<SetStateAction<boolean>>;
  popup: boolean
}

const CreateAttempt = ({setPopup, popup}: NavbarProps) => {
  return (
    <div className= {`h-screen w-screen bg-[#1e1f25]/20 backdrop-blur-2xl z-50 top-0 right-0 flex justify-center items-center p-50 ${popup?"fixed": "hidden"}`}>
      <button
        onClick={() => {
          setPopup(false);
        }}
      >
        <div className="w-10 h-10 bg-white rounded-full absolute top-15 right-15 flex justify-center items-center   ">
          <X className="text-black" />
        </div>
      </button>
      <div className=" w-full h-full bg-[#2b2c35] rounded-3xl"></div>
    </div>
  );
};

export default CreateAttempt;
