import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { WordLocal } from "./types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProgressPercentage(prev: number, trained: number, isCorrect: boolean): number {
  const correctAnswers = Math.round((prev * trained) / 100);
  trained++;
  const updatedCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
  const updatedPercentage = Math.floor((updatedCorrectAnswers / trained) * 100);
  return updatedPercentage;
}

/* retrieves a random selection of words */
export function randomizeWords(arr: WordLocal[], vol: number): WordLocal[] {
  let randomizedWords: WordLocal[] = [... arr];
  let i = randomizedWords.length - 1;

  // Fisher–Yates shuffle
  while(i > 0) {
		const n = Math.floor(Math.random() * (i+1));
    const tmp = randomizedWords[n];
   	randomizedWords[n] = randomizedWords[i];
    randomizedWords[i] = tmp;
    i--;
  }

  return randomizedWords.slice(0, vol);
}

/* shuffles given array of ints */
export function shuffleIndices(arr: number[]): number[] {
  const shuffledArr = [...arr];
  let i = arr.length - 1;
  
  // Fisher–Yates shuffle
  while(i > 0) {
		const n = Math.floor(Math.random() * (i+1));
    const tmp = shuffledArr[n];
   	shuffledArr[n] = shuffledArr[i];
    shuffledArr[i] = tmp;
    i--;
  }
  
  return shuffledArr;
}

