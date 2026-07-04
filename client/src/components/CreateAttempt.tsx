import { X } from "lucide-react";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Input } from "./ui/input";
import Stepper, { Step } from "./Stepper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";
import Stopwatch from "./Stopwatch";
import { api } from "../lib/axios";
import { axiosError } from "../lib/axios";
import type { AxiosResponse } from "axios";
import type { APIRes } from "../types/stats";

interface NavbarProps {
  setPopup: Dispatch<SetStateAction<boolean>>;
  popup: boolean;
  fetchData: () => void;
}

interface attempts {
  questionNumber: number;
  questionName: string;
  questionLink: string;
  tag: "easy" | "medium" | "hard";
  time: number;
  hint: boolean;
}

const CreateAttempt = ({ setPopup, popup, fetchData }: NavbarProps) => {
  const [attemptData, setAttemptData] = useState<attempts>({
    questionNumber: 0,
    questionName: "",
    questionLink: "",
    tag: "easy",
    time: 0,
    hint: false,
  });

  const [stepperKey, setStepperKey] = useState(0);

  const callAPI = async (data: attempts) => {
    try {
      const record = {
        questionNo: data.questionNumber,
        name: data.questionName,
        link: data.questionLink,
        tag: data.tag,
        time: data.time,
        hint: data.hint,
      };
      const response: AxiosResponse<APIRes> = await api.post(
        "/dashboard/attempt",
        record,
      );
      toast.success(response.data.msg);
      fetchData()
    } catch (e) {
      const err = axiosError(e);
      toast.error(err);
      console.log(e);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttemptData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttemptData((prev) => ({
      ...prev,
      [name]: value == "on" ? true : false,
    }));
  };

  const handleSubmit = async () => {
    if (!isFirstStepValid(attemptData)) {
      toast.error("Please fill all required fields");
      return;
    }

    await callAPI(attemptData);
    setPopup(false);
    setStepperKey((k) => k + 1);
    setAttemptData({
      questionNumber: 0,
      questionName: "",
      questionLink: "",
      tag: "easy",
      time: 0,
      hint: false,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setAttemptData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFirstStepValid = (data: attempts): boolean => {
    return !!(
      data.questionNumber &&
      data.questionName?.trim() &&
      data.questionLink?.trim() &&
      data.tag
    );
  };

  return (
    <div
      className={`h-screen w-screen bg-[#1e1f25]/20 backdrop-blur-2xl z-50 top-0 right-0 flex justify-center items-center ${popup ? "fixed" : "hidden"}`}
    >
      <button
        onClick={() => {
          setPopup(false);
        }}
      >
        <div className="w-10 h-10 bg-white rounded-full absolute top-15 right-15 flex justify-center items-center   ">
          <X className="text-black" />
        </div>
      </button>

      <div className=" w-250 h-150 bg-[#1e1f25] rounded-3xl flex justify-center p-10 px-35">
        <Stepper
          onStepChange={() => {}}
          onFinalStepCompleted={handleSubmit}
          backButtonText="Previous"
          nextButtonText="Next"
          key={stepperKey}
        >
          <Step>
            <label htmlFor="qNo">
              Question Number <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter Question Number"
              onChange={handleChange}
              name="questionNumber"
              className="qNo mb-5"
              required
            />

            <label htmlFor="qName">
              Question Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter Question Name"
              value={attemptData.questionName}
              onChange={handleChange}
              name="questionName"
              className="qName mb-5"
              required
            />

            <label htmlFor="qName">
              Question Link <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter Question Link"
              value={attemptData.questionLink}
              onChange={handleChange}
              name="questionLink"
              className="qLink mb-5"
              required
            />

            <label htmlFor="qTag">
              Select Difficulty <span className="text-destructive">*</span>
            </label>
            <Select onValueChange={(value) => handleSelectChange("tag", value)}>
              <SelectTrigger className="w-full mb-5">
                <SelectValue placeholder="Difficulty" onChange={handleChange} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Step>
          <Step>
            <div className="h-fit">
              <Stopwatch setAttemptData={setAttemptData} />
            </div>
          </Step>
          <Step>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" name="hint" onChange={handleCheckBox} />
              <p>External Help was Taken?</p>
            </label>
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default CreateAttempt;
