import React, { useState } from 'react';
import type { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { SOUND_VOLUME, errorSound } from '@/lib/globals';
import useSound from 'use-sound';
import { usePreferencesStore } from '@/lib/preferencesStore';
import VocabList from '@/components/VocabList';
import { HiPlus, HiCheckCircle, HiMiniXCircle } from "react-icons/hi2";
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { useVocabStore } from '@/lib/vocabStore';

export default function ProfileAddVocabSection({checkSingleEdit}: {checkSingleEdit: CheckSingleEditFunction}) {
  const [newVocab, setNewVocab] = useState<string>('');
  const { vocabs, addVocab } = useVocabStore(state => state);
  const { isAddVocab, toggleIsAddVocab } = useProfileStore(state => state);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const { displayPopup } = useDisplayPopup();

  function enterAddVocabMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsAddVocab(); // to true;
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function createVocab(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newVocab.length === 0 || !/\S/.test(newVocab)) {
      if (soundOn) playError();
      setErrorMsg('Title is required');
    } 
    // if there's an existing vocab with the entered title
    else if (vocabs?.some(v => v.title === newVocab)) {
      if (soundOn) playError();
      setErrorMsg('A vocabulary with this title already exists');
    } else {
      addVocab(newVocab);
      toggleIsAddVocab(); // to false
      displayPopup({isError: false, msg: "New vocabulary has been added"});
      setErrorMsg('');
    }
    setNewVocab('');
  }

  function cancelAddVocab() {
    toggleIsAddVocab(); // to false
    setNewVocab('');
    setErrorMsg('');
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      cancelAddVocab();
    }
  }

  return (
    <article>
      <h2 className='text-xl mobile:text-2xl font-bold dark:text-custom-text-dark mb-4'>Vocabularies</h2>
      <VocabList />
      {isAddVocab ? (
        <>
          <form 
            className="flex gap-3 my-3 w-2/12 justify-between items-center" 
            onSubmit={createVocab}
          >
            <input 
              className="text-lg leading-9 px-2 rounded-sm border dark:bg-main-bg-dark border-zinc-400 dark:border-zinc-300 max-w-[150px]" 
              value={newVocab} 
              onChange={(e) => setNewVocab(e.target.value)}
              onKeyDown={checkForAbort}
              size={15} 
              maxLength={15}
              autoFocus 
              data-testid="vocab-input"
            />
            <button 
              className="rounded-full bg-white mobile:bg-btn-bg mobile:hover:bg-hover-btn-bg mobile:focus:bg-hover-btn-bg mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
              aria-label="create"
              onClick={createVocab}
            >              
              <p className="hidden mobile:inline">Create</p>
              <HiCheckCircle className="inline mobile:hidden text-btn-bg hover:text-hover-btn-bg focus:text-hover-btn-bg h-9 w-9" /> 
            </button>
            <button 
              className={`rounded-full bg-white mobile:bg-secondary-bg-light mobile:hover:bg-secondary-bg-light/80 mobile:focus:bg-secondary-bg-light/80 mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm`}
              aria-label="cancel" 
              onClick={cancelAddVocab}
            >
              <p className="hidden mobile:inline">Cancel</p>
              <HiMiniXCircle className="inline mobile:hidden text-secondary-bg-light hover:text-secondary-bg-light/80 focus:text-secondary-bg-light/80 h-9 w-9" />
            </button>
          </form>
          <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
        </>
        ) : (
        <button 
          className="flex gap-1 items-center justify-center mobile:justify-start w-full mobile:w-fit rounded-lg py-2 px-3 font-semibold text-white bg-btn-bg hover:bg-hover-btn-bg hover:cursor-pointer focus:bg-hover-btn-bg transition-colors"
          onClick={enterAddVocabMode}
        >
          <HiPlus /> Add Vocabulary
        </button>
      )}
      <div className="h-px w-full dark:bg-main-bg-dark mt-3 mb-5" />
    </article>
  )
}