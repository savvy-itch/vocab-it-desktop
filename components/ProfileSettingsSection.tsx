import React, { useState } from 'react';
import type { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { useToast } from './ui/use-toast';
import useSound from 'use-sound';
import { SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';
import { HiPencilSquare } from "react-icons/hi2";

const MAX_WORDS = 200;
const MAX_ROUNDS = 20;

export default function ProfileSettingsSection({ checkSingleEdit }: { checkSingleEdit: CheckSingleEditFunction }) {
  const {
    rounds,
    lessonVolume,
    updateLessonVolume,
    updateRounds,
    soundOn } = usePreferencesStore(state => state);

  const [wordsPerLesson, setWordsPerLesson] = useState<number>(lessonVolume);
  const [roundsPerLesson, setRoundsPerLesson] = useState<number>(rounds);
  const {
    isEditWordAmount,
    isEditRoundsAmount,
    toggleIsEditWordAmount,
    toggleIsEditRoundsAmount,
  } = useProfileStore(state => state);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { toast } = useToast();
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });

  function updateWordsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(wordsPerLesson) && wordsPerLesson % 1 === 0
      && wordsPerLesson > 0 && wordsPerLesson <= MAX_WORDS) {
      updateLessonVolume(wordsPerLesson);
      toggleIsEditWordAmount(); // to false
      toast({
        variant: 'default',
        description: "Words amount has been updated",
      });
      if (soundOn) playSuccess();
      setErrorMsg('');
    } else {
      if (soundOn) playError();
      setWordsPerLesson(1);
      setErrorMsg("Enter valid amount of words");
    }
  }

  function updateRoundsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(roundsPerLesson) && roundsPerLesson % 1 === 0
      && roundsPerLesson > 0 && roundsPerLesson <= MAX_ROUNDS) {
      updateRounds(roundsPerLesson);
      toggleIsEditRoundsAmount(); // to false
      toast({
        variant: 'default',
        description: "Rounds amount has been updated",
      });
      if (soundOn) playSuccess();
      setErrorMsg('');
    } else {
      if (soundOn) playError();
      setRoundsPerLesson(1);
      setErrorMsg("Enter valid amount of rounds");
    }
  }

  function enterEditWordsMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditWordAmount(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function enterEditRoundsMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditRoundsAmount(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      if (isEditWordAmount) {
        toggleIsEditWordAmount(); // to false
        setWordsPerLesson(lessonVolume);
      } else if (isEditRoundsAmount) {
        toggleIsEditRoundsAmount(); // to false
        setRoundsPerLesson(rounds);
      }
      setErrorMsg('');
    }
  }

  function cancelWordsUpdate() {
    toggleIsEditWordAmount();
    setWordsPerLesson(lessonVolume);
  }

  function cancelRoundsUpdate() {
    toggleIsEditRoundsAmount();
    setRoundsPerLesson(rounds);
  }

  return (
    <article>
      <h2 className='text-xl mobile:text-2xl font-bold dark:text-custom-text-dark mb-4'>Settings</h2>
      <h3 className="text-base mobile:text-lg md:text-xl font-bold dark:text-custom-text-dark my-4">Words per lesson:</h3>
      {isEditWordAmount ? (
        <form className="my-3 max-w-max" onSubmit={updateWordsAmount}>
          <div className="flex gap-3 justify-between items-center">
            <input
              className="text-lg text-center leading-9 px-2 rounded-sm dark:bg-main-bg-dark border border-zinc-400 dark:border-zinc-300"
              value={wordsPerLesson}
              type="number"
              onChange={(e) => setWordsPerLesson(parseInt(e.target.value))}
              onKeyDown={checkForAbort}
              size={5}
              max={MAX_WORDS}
              min={1}
              required
              autoFocus
            />
            <button
              className="rounded-full bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-white dark:text-white hover:cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
              onSubmit={updateWordsAmount}
            >
              Update
            </button>
            <button
              className="rounded-full mobile:bg-secondary-bg-light mobile:hover:bg-secondary-bg-light/80 text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
              onClick={cancelWordsUpdate}
            >
              Cancel
            </button>
          </div>
          {errorMsg.length > 0 ? (
            <p className="text-xs italic mt-2">Enter a number between 1 and {MAX_WORDS}</p>
          ) : (
            <p className="text-xs text-red-800 mt-2">{errorMsg}</p>
          )}
        </form>
      ) : (
        <div className="flex my-3 w-1/2 mobile:w-1/3 sm:w-2/12 gap-2 items-center">
          <p className="text-lg text-center font-semibold dark:text-custom-text-dark border dark:bg-main-bg-dark px-2 py-1 w-20 rounded-sm">
            {wordsPerLesson}
          </p>
          <button
            className="dark:text-custom-text-dark py-1 text-lg hover:cursor-pointer"
            aria-label="edit"
            onClick={enterEditWordsMode}
          >
            <HiPencilSquare />
          </button>
        </div>
      )}

      <h3 className="text-base mobile:text-lg md:text-xl font-bold dark:text-custom-text-dark my-4">Rounds per Find a Pair lesson:</h3>
      {isEditRoundsAmount ? (
        <form className="my-3 max-w-max" onSubmit={updateRoundsAmount}>
          <div className="flex gap-3 justify-between items-center">
            <input
              className="text-lg text-center leading-9 px-2 rounded-sm dark:bg-main-bg-dark border border-zinc-400 dark:border-zinc-300"
              value={roundsPerLesson}
              type="number"
              onChange={(e) => setRoundsPerLesson(parseInt(e.target.value))}
              onKeyDown={checkForAbort}
              size={5}
              max={MAX_ROUNDS}
              min={1}
              required
              autoFocus
            />
            <button
              className="rounded-full bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-white dark:text-white hover:cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
              onSubmit={updateRoundsAmount}
            >
              Update
            </button>
            <button
              className="rounded-full mobile:bg-secondary-bg-light mobile:hover:bg-secondary-bg-light/80 text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
              onClick={cancelRoundsUpdate}
            >
              Cancel
            </button>
          </div>
          {errorMsg.length > 0 ? (
            <p className="text-xs italic mt-2">Enter a number between 1 and {MAX_ROUNDS}</p>
          ) : (
            <p className="text-xs text-red-800 mt-2">{errorMsg}</p>
          )}
        </form>
      ) : (
        <div className="flex my-3 w-1/2 mobile:w-1/3 sm:w-2/12 gap-2 items-center">
          <p className="text-lg text-center font-semibold dark:text-custom-text-dark border dark:bg-main-bg-dark px-2 py-1 w-20 rounded-sm">
            {roundsPerLesson}
          </p>
          <button
            className="dark:text-custom-text-dark py-1 text-lg hover:cursor-pointer"
            aria-label="edit"
            onClick={enterEditRoundsMode}
          >
            <HiPencilSquare />
          </button>
        </div>
      )}
      <div className="h-px w-full dark:bg-main-bg-dark mt-3 mb-5" />
    </article>
  )
}