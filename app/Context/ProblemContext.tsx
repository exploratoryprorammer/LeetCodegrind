import { createContext } from "react";
type Problem = { _id: string; coder: string; title: string; date: string };
type ProblemContextType = {
  problemset: Problem[];
  setProblemset: React.Dispatch<React.SetStateAction<Problem[]>>;
};
export const ProblemContext = createContext<ProblemContextType | undefined>(
  undefined
);
