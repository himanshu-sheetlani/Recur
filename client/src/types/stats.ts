export interface APIRes {
  msg: string;
}

interface questionDetails {
  _id:string,
  questionNo: number,
  name: string,
  tag: "easy" | "medium" | "hard",
  link: string,
}

export interface attempt {
  _id: string;
  userId: string;
  questionId: questionDetails;
  time: number;
  hint: boolean;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

export interface stats extends APIRes {
  tag: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalQuestion: number;
  avgTime: number;
  recentAttempt: attempt[];
}
