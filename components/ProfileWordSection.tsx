import React, { useEffect, useState } from 'react';
import type { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { useToast } from './ui/use-toast';
import useSound from 'use-sound';
import { SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';
import { Button } from '@/components/ui/button';
import { HiPencilSquare } from "react-icons/hi2";

const MAX_WORDS = 200;

export default function ProfileWordSection({checkSingleEdit}: {checkSingleEdit: CheckSingleEditFunction}) {
  const [wordsPerLesson, setWordsPerLesson] = useState<number>(0);
  const preferenceStore = useStore(usePreferencesStore, (state) => state);
  const {
    isEditWordAmount, 
    toggleIsEditWordAmount,
  } = useProfileStore(state => state);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { toast } = useToast();
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });

  function updateWordsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(wordsPerLesson) && wordsPerLesson % 1 === 0 
      && wordsPerLesson > 0 && preferenceStore && wordsPerLesson <= MAX_WORDS) {
      preferenceStore.updateLessonVolume(wordsPerLesson);
      toggleIsEditWordAmount(); // to false
      toast({
        variant: 'default',
        description: "Words per lesson amount has been updated",
      });
      if (preferenceStore.soundOn) playSuccess();
      setErrorMsg('');
    } else {
      if (preferenceStore.soundOn) playError();
      setWordsPerLesson(1);
      setErrorMsg("Enter valid amount of words");
    }
  }

  function enterEditWordsMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditWordAmount(); // to true
    } else {
      if (preferenceStore.soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setWordsPerLesson(preferenceStore.lessonVolume);
      toggleIsEditWordAmount(); // to false
      setErrorMsg('');
    }
  }

  useEffect(() => {
    if (preferenceStore) {
      setWordsPerLesson(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  return (
    <article>
      <h2 className='text-xl mobile:text-2xl font-bold dark:text-custom-text-dark mb-4'>Lessons</h2>
      <h3 className="text-base mobile:text-lg md:text-xl font-bold dark:text-custom-text-dark my-4">Words per lesson:</h3>
      {isEditWordAmount ? (
        <form className="my-3 max-w-max" onSubmit={updateWordsAmount}>
          <div className="flex gap-3 justify-between items-center">
            <input 
              className="text-lg text-center leading-9 px-2 rounded-sm dark:bg-main-bg-dark border border-zinc-400 dark:border-zinc-300" 
              value={wordsPerLesson} 
              onChange={(e) => setWordsPerLesson(Number(e.target.value))} 
              onKeyDown={checkForAbort}
              size={5}
              maxLength={3}
              max={MAX_WORDS}
              autoFocus 
            />
            <Button 
              className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-white dark:text-white hover:cursor-pointer"
              onSubmit={updateWordsAmount}
            >
              Update
            </Button>
          </div>
          {errorMsg.length > 0 ? (
            <p className="text-xs italic mt-2">Enter a number between 5 and 50</p>
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
      <div className="h-px w-full dark:bg-main-bg-dark mt-3 mb-5" />
    </article>
  )
}