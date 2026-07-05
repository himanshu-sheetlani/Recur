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
  hint: boolean;
}

interface attemptParams {
  setAttemptData: Dispatch<SetStateAction<attempts>>;
}

export default function Stopwatch({
  setAttemptData,
}: attemptParams): React.JSX.Element {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current + accumulatedTimeRef.current;
        setTime(elapsed);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      accumulatedTimeRef.current = time;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    const totalSeconds = Math.floor(time / 1000);
    setAttemptData((prev) => ({
      ...prev,
      time: totalSeconds,
    }));
  }, [time, setAttemptData]);

  const handleStartPause = (): void => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setTime(0);
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
  };

  const formatTime = (totalMs: number): string => {
    const minutes: number = Math.floor((totalMs / 60000) % 60);
    const seconds: number = Math.floor((totalMs / 1000) % 60);
    const milliseconds: number = Math.floor((totalMs % 1000) / 10);

    const pad = (num: number): string => String(num).padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  return (
    <div className="w-full max-w-sm rounded-2xl p-6 shadow-lg ">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-medium uppercase">
          Stopwatch
        </span>
      </div>

      <div className="mt-6 text-center">
        <h1 className="font-mono text-5xl font-bold tracking-wider">
          {formatTime(time)}
        </h1>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button size="lg" onClick={handleStartPause} className="min-w-28">
          {isRunning ? "Stop" : time === 0 ? "Start" : "Resume"}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={handleReset}
          className="min-w-28"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
