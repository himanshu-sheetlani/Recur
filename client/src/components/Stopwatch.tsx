import { Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

import type { Dispatch, SetStateAction } from "react";

interface attempts {
  questionNumber: number;
  questionName: string;
  questionLink: string;
  tag: "easy" | "medium" | "hard";
  time: number;
}

interface attemptParams {
  setAttemptData: Dispatch<SetStateAction<attempts>>;
}

export default function Stopwatch({setAttemptData}: attemptParams): React.JSX.Element {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartPause = (): void => {
    setIsRunning((prev) => !prev);
    handleGetTime();
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(0);
  };

  const handleGetTime = (): void => {
    const handleChange = (name: string, value: number) => {
      setAttemptData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    handleChange('time', Math.floor((time / 1000) % 60))
  };

  const formatTime = (totalMs: number): string => {
    const minutes: number = Math.floor((totalMs / 60000) % 60);
    const seconds: number = Math.floor((totalMs / 1000) % 60);
    const milliseconds: number = Math.floor((totalMs % 1000) / 10);

    const pad = (num: number): string => String(num).padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  return (
    <div className="text-center">
      <p className="inline">
        <Clock />
        Timer
      </p>
      <h1>{formatTime(time)}</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Button onClick={handleStartPause}>
          {isRunning ? "Stop" : time == 0 ? "Start" : "Resume"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}
