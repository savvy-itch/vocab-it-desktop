import { useEffect, useRef, useState } from 'react';
import { clickSound, SOUND_VOLUME, specialSymbols } from '@/lib/globals';
import { usePreferencesStore } from '@/lib/preferencesStore';
import type { Answer, VocabLocal, WordLocal } from '@/lib/types';
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';
import useSound from 'use-sound';
import type { Route } from '../+types/root';
import LessonResult from '@/components/LessonResult';
import { Link } from 'react-router';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import HintButton from '@/components/HintButton';
import EndLessonDialog from '@/components/EndLessonDialog';
import { BsCapslock, BsCapslockFill } from "react-icons/bs";

const initialWordIdx = 1;

function randomizeWords(array: WordLocal[], volume: number): WordLocal[] {
  let randomizedWords: WordLocal[] = [];
  let sourceArray: WordLocal[] = array;
  for (let i = 0; i < volume; i++) {
    let randomIdx: number = Math.floor(Math.random() * sourceArray.length);
    randomizedWords.push(sourceArray[randomIdx]);
    sourceArray = sourceArray.filter((_, i) => i !== randomIdx);
  }
  return randomizedWords;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vocab-It | Lesson" },
    { name: "description", content: "Lesson page" },
  ];
}

export default function Lesson({
  params,
}: Route.ComponentProps) {
  const [lessonVolume, setLessonVolume] = useState<number>(0);
  const [currWord, setCurrWord] = useState<number>(initialWordIdx);
  const [currVocabWords, setCurrVocabWords] = useState<WordLocal[]>([]);
  const [lessonWords, setLessonWords] = useState<WordLocal[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpperCase, setIsUpperCase] = useState(false);
  const preferenceStore = usePreferencesStore(state => state);
  const [currVocab, setCurrVocab] = useState<VocabLocal>();
  const { vocabs } = useVocabStore(state => state);
  const { words, updateProgress } = useWordStore(state => state);
  const [playClick] = useSound(clickSound, { volume: SOUND_VOLUME });
  const inputRef = useRef<HTMLInputElement>(null);

  function submitAnswer(e: React.SyntheticEvent) {
    e.preventDefault();
    registerAnswer();
    if (preferenceStore.soundOn) playClick();
  }

  function registerAnswer() {
    const i = currWord - 1;
    const userAnswer: Answer = {
      _id: lessonWords[i]._id,
      word: lessonWords[i].word,
      translation: lessonWords[i].translation,
      userAnswer: answer.trim()
    };
    setAllAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    setCurrWord(currWord + 1);
    setAnswer('');
  }

  function restartLesson() {
    setCurrWord(1);
    setAllAnswers([]);
    const vocabExists = vocabs.some(v => v._id === params.vocabId);
    if (vocabExists) {
      const wordsForLesson: WordLocal[] = randomizeWords(currVocabWords, lessonVolume);
      setLessonWords(wordsForLesson);
    }
  }

  function handleSpecialKeyClick(key: string) {
    setAnswer((prev: string) => prev + (isUpperCase ? key.toUpperCase() : key))
    inputRef.current && inputRef.current.focus();
    setIsUpperCase(false);
  }

  function handleUppercaseToggle() {
    setIsUpperCase(!isUpperCase);
    inputRef.current && inputRef.current.focus();
  }

  // get all vocab words by default
  useEffect(() => {
    setIsLoading(true);
    const existingVocab = vocabs.find(v => v._id === params.vocabId);
    if (existingVocab) {
      setCurrVocab(existingVocab);
      const vocabStorageWords: WordLocal[] = [];
      existingVocab.wordIds.map(wordId => {
        if (words[wordId]) {
          vocabStorageWords.push(words[wordId]);
        }
      });
      setCurrVocabWords(vocabStorageWords);
    }
    setIsLoading(false);
  }, [params.vocabId]);

  useEffect(() => {
    if (preferenceStore) {
      setLessonVolume(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  useEffect(() => {
    const existingVocab = vocabs.find(v => v._id === params.vocabId);
    if (existingVocab && existingVocab.wordIds.length > 0 && lessonVolume > 0) {
      const wordsForLesson: WordLocal[] = randomizeWords(currVocabWords, lessonVolume);
      if (lessonVolume > existingVocab.wordIds.length) {
        setLessonVolume(existingVocab.wordIds.length);
        setLessonWords(randomizeWords(wordsForLesson, existingVocab.wordIds.length));
      } else {
        setLessonWords(randomizeWords(wordsForLesson, lessonVolume));
      }
      setIsLoading(false);
    }
  }, [lessonVolume, params.vocabId]);

  // lesson end
  useEffect(() => {
    if (currWord !== initialWordIdx && currWord > lessonVolume) {
      updateProgress(allAnswers);
    }
  }, [params.vocabId, currWord, lessonVolume]);

  useEffect(() => {
    // only fetch data if vocab is different from the last one
    if (vocabs.some(v => v._id === params.vocabId)) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading])

  // end of lesson
  if (currWord > lessonVolume) {
    return (
      <>
        <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
          <LessonResult allAnswers={allAnswers} words={lessonWords} />
          <div className="flex justify-between mt-5 px-3">
            <button
              className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white bg-zinc-600 hover:bg-zinc-500 focus:bg-zinc-500 hover:cursor-pointer transition-colors"
              onClick={restartLesson}
            >
              Start Again
            </button>
            <button className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white bg-zinc-600 hover:bg-zinc-500 focus:bg-zinc-500 hover:cursor-pointer transition-colors">
              <Link to="/">Back to Profile</Link>
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
        <p className="mx-3">{currWord}/{lessonVolume}</p>
        <Progress
          className="my-3"
          value={Math.round(((currWord - 1) / lessonVolume) * 100)}
          aria-label="progress bar"
        />
        <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
          <div>
            <h2 className="text-xl mobile:text-2xl">Word:</h2>
            {(!isLoading && lessonWords[currWord - 1]) ? (
              <p className="text-2xl mobile:text-3xl text-center my-3">
                {lessonWords[currWord - 1].translation}
              </p>
            ) : (
              <div className="w-full flex justify-center my-3">
                <Skeleton className="h-8 mobile:h-9 w-1/4" />
              </div>
            )}
          </div>
          <div className="h-px my-5 w-full bg-zinc-400 dark:bg-main-bg-dark" />
          <div>
            <div className="flex justify-between">
              <h2 className="text-xl mobile:text-2xl">Enter translation:</h2>
              {(!isLoading && lessonWords[currWord - 1]) ? (
                <HintButton word={lessonWords[currWord - 1].word} />
              ) : (
                <Skeleton className="w-[38px] h-[38px] rounded-sm" />
              )}
            </div>
            <form className="my-3 flex justify-center" onSubmit={submitAnswer}>
              <input
                ref={inputRef}
                className="text-2xl leading-10 text-center rounded-sm border border-zinc-400 dark:border-zinc-300 w-full mobile:w-auto dark:bg-main-bg-dark"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
                autoFocus
                spellCheck="false"
                disabled={isLoading}
              />
            </form>
          </div>
        </section>
        <div className="flex justify-between mt-5 px-3">
          <EndLessonDialog />
          <button
            className="w-16 text-sm mobile:text-base mobile:w-28 flex justify-center items-center rounded-lg py-2 font-semibold text-white bg-zinc-600 hover:bg-zinc-500 hover:cursor-pointer focus:bg-zinc-500 transition-colors disabled:text-gray-400"
            onClick={registerAnswer}
            disabled={isLoading}
          >
            Skip
          </button>
          <button
            className="w-16 text-sm mobile:text-base mobile:w-28 flex justify-center items-center rounded-lg py-2 font-semibold text-white bg-btn-bg hover:bg-hover-btn-bg hover:cursor-pointer focus:bg-hover-btn-bg transition-colors disabled:text-gray-400"
            onClick={registerAnswer}
            disabled={isLoading}
          >
            OK
          </button>
        </div>
        {currVocab?.lang && Object.getOwnPropertyNames(specialSymbols).includes(currVocab.lang) && (
          <section className="flex justify-center gap-2 flex-wrap mt-3">
            {currVocab?.lang !== 'default' && (
              <button
                className="px-3 py-2 bg-gray-300 text-custom-text-light rounded-md shadow-md font-mono text-xl font-semibold transition-all duration-100 ease-in-out hover:bg-gray-400 hover:cursor-pointer"
                onClick={handleUppercaseToggle}
                type="button"
              >
                {isUpperCase ? <BsCapslockFill /> : <BsCapslock />}
              </button>
            )}
            {currVocab?.lang && currVocab.lang !== 'default' && specialSymbols[currVocab?.lang].map(k => {
              return <button
                key={k}
                className="px-3 py-2 bg-gray-300 text-custom-text-light rounded-md shadow-md font-mono text-xl font-semibold transition-all duration-100 ease-in-out hover:bg-gray-400 hover:cursor-pointer"
                type="button"
                onClick={() => handleSpecialKeyClick(k)}
              >
                {isUpperCase ? k.toUpperCase() : k}
              </button>
            })}
          </section>
        )}
      </div>
    </>
  )
}
