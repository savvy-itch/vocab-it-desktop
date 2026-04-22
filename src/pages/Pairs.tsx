import type { Answer, VocabLocal, WordLocal } from '@/lib/types';
import useSound from 'use-sound';
import { useEffect, useState } from 'react'
import { clickSound, errorSound, SOUND_VOLUME, successSound } from '@/lib/globals';
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { randomizeWords, shuffleIndices } from '@/lib/utils';
import PairsEndScreen from '@/components/PairsEndScreen';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import EndLessonDialog from '@/components/EndLessonDialog';
import { useParams } from 'react-router';

type PressedBtns = {
  word: string | null,
  translation: string | null
}

const defWordsPerCard = 5;
const defRounds = 5;

export default function Pairs() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [curVocab, setCurVocab] = useState<VocabLocal>();
  const [allVocabWords, setAllVocabWords] = useState<WordLocal[]>([]);
  const [lessonWords, setLessonWords] = useState<WordLocal[]>([]);
  const [curCardCount, setCurCardCount] = useState<number>(0);
  const [curCardWordIdxs, setCurCardWordIdxs] = useState<number[]>([]);
  const [curCardTranslationIdxs, setCurCardTranslationIdxs] = useState<number[]>([]);
  const [pressedBtns, setPressedBtns] = useState<PressedBtns>({ word: null, translation: null });
  const [hiddenPairs, setHiddenPairs] = useState<Set<string>>(new Set());
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const [playClick] = useSound(clickSound, { volume: SOUND_VOLUME });

  const { vocabs } = useVocabStore(state => state);
  const { words, updateProgress } = useWordStore(state => state);
  const { rounds, soundOn } = usePreferencesStore(state => state);

  const preferredRounds = rounds ?? defRounds;
  const wordsTotal = curVocab?.wordIds.length ?? 0;
  const lessonVolume: number = Math.min(preferredRounds * defWordsPerCard, wordsTotal);
  const trueRounds = Math.ceil(lessonVolume / defWordsPerCard);

  function handleBtnClick(id: string, word: string, translation: string, isTranslation: boolean) {
    if (isTranslation) {
      if (!pressedBtns.word) {
        // pressing the same button again
        if (soundOn) {
          playClick();
        }
        if (pressedBtns.translation === id) {
          setPressedBtns({ word: null, translation: null });
        } else {
          // first word btn press
          setPressedBtns({ ...pressedBtns, translation: id });
        }
      } else if (pressedBtns?.word === id) {
        // correct guess
        if (soundOn) {
          playSuccess();
        }
        const updatedPairs = new Set(hiddenPairs).add(id);
        setHiddenPairs(updatedPairs);
        registerAnswer(id, word, translation, word);
        setPressedBtns({ word: null, translation: null });
        checkCardUpdate(updatedPairs);
      } else {
        // wrong guess
        if (soundOn) {
          playError();
        }
        if (pressedBtns.word) {
          const w = lessonWords.find(w => w._id === pressedBtns.word);
          w && registerAnswer(pressedBtns.word, w.word, w.translation, w.word);
        }
        setPressedBtns({ word: null, translation: null });
      }
    } else {
      if (!pressedBtns.translation) {
        if (soundOn) {
          playClick();
        }
        // pressing the same button again
        if (pressedBtns.word === id) {
          setPressedBtns({ word: null, translation: null });
        } else {
          // first word btn press
          setPressedBtns({ ...pressedBtns, word: id });
        }
      } else if (pressedBtns?.translation === id) {
        // correct guess
        if (soundOn) {
          playSuccess();
        }
        const updatedPairs = new Set(hiddenPairs).add(id);
        setHiddenPairs(updatedPairs);
        registerAnswer(id, word, translation, word);
        setPressedBtns({ word: null, translation: null });
        checkCardUpdate(updatedPairs);
      } else {
        // wrong guess
        if (soundOn) {
          playError();
        }
        if (pressedBtns.translation) {
          const w = lessonWords.find(w => w._id === pressedBtns.translation);
          w && registerAnswer(pressedBtns.translation, w.word, w.translation, w.word);
        }
        setPressedBtns({ word: null, translation: null });
      }
    }
  }

  function registerAnswer(id: string, word: string, translation: string, userAnswer: string) {
    const answer: Answer = {
      _id: id,
      word,
      translation,
      userAnswer
    };
    setAllAnswers(prev => [...prev, answer]);
  }

  function checkCardUpdate(updatedPairs: Set<string>) {
    if ((curCardCount + 1) === trueRounds && updatedPairs.size === curCardSize) {
      updateProgress(allAnswers);
    } else if (updatedPairs.size === curCardSize && updatedPairs.size > 0) {
      // next card
      setCurCardCount(prev => prev + 1);
      setHiddenPairs(new Set());
      setPressedBtns({ word: null, translation: null });
    }
  }

  function restartLesson() {
    setIsLoading(true);
    setLessonWords([]);
    setCurCardCount(0);
    setHiddenPairs(new Set());
  }

  // get all vocab words by default
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setAllVocabWords(vocabStorageWords);
    } else {
      alert("Vocabulary doesn't exist");
    }
  }, [params.vocabId, vocabs, words]);

  // get a randomized selection of words for lesson from pool
  useEffect(() => {
    if (!curVocab
      || allVocabWords.length === 0
      || lessonWords.length > 0) {
      return;
    }

    const randomized = randomizeWords(allVocabWords, lessonVolume);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLessonWords(randomized);
  }, [allVocabWords, lessonWords.length, curVocab, lessonVolume]);

  const remainingWordsPerCard = lessonVolume - (curCardCount * defWordsPerCard);
  const curCardSize = Math.min(remainingWordsPerCard, defWordsPerCard);

  useEffect(() => {
    if (lessonWords.length === 0) return;

    const arr: number[] = [];
    const start = curCardCount * defWordsPerCard;
    const end = start + curCardSize;

    for (let i = start; i < end; i++) {
      arr.push(i);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurCardWordIdxs(arr);
    setCurCardTranslationIdxs(shuffleIndices(arr));
    setIsLoading(false);
  }, [curCardCount, lessonVolume, lessonWords.length, curCardSize]);

  const isLessonOver: boolean = (curCardCount + 1) === trueRounds && hiddenPairs.size === curCardSize;

  if (isLessonOver) {
    return <PairsEndScreen vocabId={params.vocabId as string} restart={restartLesson} />
  }

  return (
    <>
      <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
        <p className="mx-3">{curCardCount + 1}/{trueRounds}</p>
        <Progress
          className="my-3"
          value={curCardCount / trueRounds * 100}
          aria-label="progress bar"
        />
        <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
          <h1 className="text-center text-xl mb-5">Find a pair</h1>
          <div className="flex justify-between">
            <div className="flex flex-col gap-3 w-2/5">
              {isLoading ? (
                <>
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                </>
              ) : (
                curCardWordIdxs?.map(idx => (
                  <button
                    key={`w-${lessonWords[idx]._id}`}
                    onClick={() => handleBtnClick(lessonWords[idx]._id, lessonWords[idx].word, lessonWords[idx].translation, false)}
                    className={`${hiddenPairs.has(lessonWords[idx]._id) ? "opacity-0 transition-opacity" : "text-center rounded-lg text-white bg-btn-bg hover:bg-hover-btn-bg hover:cursor-pointer focus:bg-hover-btn-bg disabled:bg-btn-bg/40 border-zinc-400 transition-colors"} p-3 mobile:px-4 text-sm mobile:text-base font-semibold border transition`}
                    disabled={Boolean(pressedBtns.word && pressedBtns?.word !== lessonWords[idx]._id)}
                  >
                    {lessonWords[idx].word}
                  </button>
                ))
              )}
            </div>
            <div className="flex flex-col gap-3 w-2/5">
              {isLoading ? (
                <>
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                  <Skeleton className="h-12.5 w-full" />
                </>
              ) : (
                curCardTranslationIdxs?.map(idx => (
                  <button
                    key={`t-${lessonWords[idx]._id}`}
                    onClick={() => handleBtnClick(lessonWords[idx]._id, lessonWords[idx].word, lessonWords[idx].translation, true)}
                    className={`${hiddenPairs.has(lessonWords[idx]._id) ? "opacity-0 transition-opacity" : "text-center rounded-lg text-white bg-rose-800 hover:bg-rose-900 hover:cursor-pointer focus:bg-rose-900 disabled:bg-rose-800/40 border-zinc-400 transition-colors"} p-3 mobile:px-4 text-sm mobile:text-base font-semibold border`}
                    disabled={Boolean(pressedBtns.translation && pressedBtns?.translation !== lessonWords[idx]._id)}
                  >
                    {lessonWords[idx].translation}
                  </button>
                ))
              )}
            </div>
          </div>
        </section>
        <div className="flex justify-center mt-5 px-3">
          <EndLessonDialog />
        </div>
      </div>
    </>
  )
}
