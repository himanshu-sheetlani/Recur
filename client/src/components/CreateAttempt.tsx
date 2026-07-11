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
  fetchData?: () => void;
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
      fetchData?.();
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
    const { name, checked } = e.target;
    setAttemptData((prev) => ({
      ...prev,
      [name]: checked,
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
      className={`fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4 ${popup ? "block" : "hidden"}`}
    >
      <button
        onClick={() => {
          setPopup(false);
        }}
        className="absolute top-4 right-4 z-10"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white hover:bg-gray-200 transition rounded-full flex justify-center items-center">
          <X className="text-black h-4 w-4 md:h-5 md:w-5" />
        </div>
      </button>

      <div className="w-full max-w-2xl bg-[#1e1f25] border border-white/10 rounded-3xl flex flex-col justify-between p-6 md:p-10 h-150">
        <Stepper
          onStepChange={() => {}}
          onFinalStepCompleted={handleSubmit}
          backButtonText="Previous"
          nextButtonText="Next"
          key={stepperKey}
          disableStepIndicators={true}
        >
          <Step>
            <label htmlFor="qNo">
              Question Number <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Enter Question Number"
              type="number"
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
              type="text"
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
              type="text"
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
