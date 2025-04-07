import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProgressPercentage(prev: number, trained: number, isCorrect: boolean): number {
  const correctAnswers = (prev * trained) / 100;
  trained++;
  const updatedCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
  const updatedPercentage = Math.floor((updatedCorrectAnswers / trained) * 100);
  return updatedPercentage;
}
