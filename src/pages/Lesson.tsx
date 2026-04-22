import { useEffect, useRef, useState } from 'react';
import { clickSound, INITIAL_AMOUNT, SOUND_VOLUME, specialSymbols } from '@/lib/globals';
import { usePreferencesStore } from '@/lib/preferencesStore';
import type { Answer, VocabLocal, WordLocal } from '@/lib/types';
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';
import useSound from 'use-sound';
import LessonResult from '@/components/LessonResult';
import { Link, useParams } from 'react-router';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import HintButton from '@/components/HintButton';
import EndLessonDialog from '@/components/EndLessonDialog';
import { BsCapslock, BsCapslockFill } from "react-icons/bs";
import { randomizeWords } from '@/lib/utils';

const initialWordIdx = 1;

export default function Lesson() {
  let params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [curVocab, setCurVocab] = useState<VocabLocal>();
  const [curVocabWords, setCurVocabWords] = useState<WordLocal[]>([]);
  const [lessonWords, setLessonWords] = useState<WordLocal[]>([]);
  const [curWord, setCurWord] = useState<number>(initialWordIdx);
  const [answer, setAnswer] = useState<string>('');
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isUpperCase, setIsUpperCase] = useState(false);

  const { vocabs } = useVocabStore(state => state);
  const preferenceStore = usePreferencesStore(state => state);
  const { words, updateProgress } = useWordStore(state => state);
  const [playClick] = useSound(clickSound, { volume: SOUND_VOLUME });
  const inputRef = useRef<HTMLInputElement>(null);

  function submitAnswer(e: React.SyntheticEvent) {
    e.preventDefault();
    registerAnswer();
    if (preferenceStore.soundOn) playClick();
  }

  const estimatedVolume = curVocab?.wordIds.length ?? INITIAL_AMOUNT;
  const lessonVolume = Math.min(estimatedVolume, preferenceStore.lessonVolume);

  function registerAnswer() {
    const i = curWord - 1;
    const userAnswer: Answer = {
      _id: lessonWords[i]._id,
      word: lessonWords[i].word,
      translation: lessonWords[i].translation,
      userAnswer: answer.trim()
    };
    const updatedAnswers: Answer[] = [...allAnswers, userAnswer];
    const updatedWord = curWord + 1;
    // if end of the lesson
    if (updatedWord !== initialWordIdx && updatedWord > lessonVolume) {
      updateProgress(updatedAnswers);
    }
    setAllAnswers(updatedAnswers);
    setCurWord(updatedWord);
    setAnswer('');
  }

  function restartLesson() {
    setCurWord(1);
    setAllAnswers([]);
    const vocabExists = vocabs.some(v => v._id === params.vocabId);
    if (vocabExists) {
      const wordsForLesson: WordLocal[] = randomizeWords(curVocabWords, lessonVolume);
      setLessonWords(wordsForLesson);
    }
  }

  // insert special character at the current cursor position
  function handleSpecialKeyClick(key: string) {
    if (inputRef.current) {
      const cursorPos = inputRef.current.selectionStart ?? 0;
      setAnswer((prev: string) => prev.substring(0, cursorPos) + (isUpperCase ? key.toUpperCase() : key) + prev.substring(cursorPos));
      inputRef.current.focus();
      setIsUpperCase(false);
    }
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
      setCurVocab(existingVocab);
      const vocabStorageWords: WordLocal[] = [];
      existingVocab.wordIds.map(wordId => {
        if (words[wordId]) {
          vocabStorageWords.push(words[wordId]);
        }
      });
      setCurVocabWords(vocabStorageWords);
    }
    setIsLoading(false);
  }, [params.vocabId, vocabs, words]);

  useEffect(() => {
    if (curVocab && curVocab.wordIds.length > 0 && lessonVolume > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLessonWords(randomizeWords(curVocabWords, lessonVolume));
      setIsLoading(false);
    }
  }, [curVocabWords, curVocab, lessonVolume]);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading])

  // end of lesson
  if (curWord > lessonVolume) {
    return (
      <>
        <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
          <LessonResult allAnswers={allAnswers} wordsLen={lessonWords.length} />
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

  // lesson flash card
  return (
    <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
      <p className="mx-3">{curWord}/{lessonVolume}</p>
      <Progress
        className="my-3"
        value={Math.round(((curWord - 1) / lessonVolume) * 100)}
        aria-label="progress bar"
      />
      <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <div>
          <h2 className="text-xl mobile:text-2xl">Word:</h2>
          {(!isLoading && lessonWords[curWord - 1]) ? (
            <p className="text-2xl mobile:text-3xl text-center my-3">
              {lessonWords[curWord - 1].translation}
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
            {(!isLoading && lessonWords[curWord - 1]) ? (
              <div className="flex gap-3">
                <HintButton word={lessonWords[curWord - 1].word} hintType="letter" />
                <HintButton word={lessonWords[curWord - 1].word} hintType="word" />
              </div>
            ) : (
              <Skeleton className="w-9.5 h-9.5 rounded-sm" />
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
      {(!isLoading && lessonWords[curWord - 1]) && (
        <>
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
          {curVocab?.lang && Object.getOwnPropertyNames(specialSymbols).includes(curVocab.lang) && (
            <section className="flex justify-center gap-2 flex-wrap mt-3">
              {curVocab?.lang !== 'default' && (
                <button
                  className="px-3 py-2 bg-gray-300 text-custom-text-light rounded-md shadow-md font-mono text-xl font-semibold transition-all duration-100 ease-in-out hover:bg-gray-400 hover:cursor-pointer"
                  onClick={handleUppercaseToggle}
                  type="button"
                >
                  {isUpperCase ? <BsCapslockFill /> : <BsCapslock />}
                </button>
              )}
              {curVocab?.lang && curVocab.lang !== 'default' && specialSymbols[curVocab?.lang].map(k => {
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
        </>
      )}
    </div>
  )
}
