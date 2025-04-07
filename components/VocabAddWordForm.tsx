import React, { useState } from 'react';
import type { CheckSingleEditFunction } from '@/lib/types';
import { SOUND_VOLUME, errorSound } from '@/lib/globals';
import useSound from 'use-sound';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { Label } from '@/components/ui/label';
import { HiPlus } from "react-icons/hi2";
import FileForm from './FileForm';
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';
import { nanoid } from 'nanoid';

export default function VocabAddWordForm({ vocabWords, vocabId, checkSingleEdit }: {
  vocabWords: string[],
  vocabId: string,
  checkSingleEdit: CheckSingleEditFunction
}) {
  const [newWord, setNewWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const { words } = useWordStore(state => state);
  const { isAddWord, toggleIsAddWord } = useProfileStore(state => state);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const { addWord } = useWordStore(state => state);
  const { addWordId } = useVocabStore(state => state);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const { displayPopup } = useDisplayPopup();

  function enterAddWordMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsAddWord(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field.');
    }
  }

  function handleAddWord(e: React.SyntheticEvent) {
    e.preventDefault();

    let duplicateWord = false;
    vocabWords.forEach(id => {
      if (words[id] && words[id].word === newWord && words[id].vocabId === vocabId) {
        duplicateWord = true;
      }
    });

    // if the title is empty or only consists of spaces
    if (newWord.length === 0 || !/\S/.test(newWord)) {
      if (soundOn) playError();
      setErrorMsg('Please enter a valid word');
    } else if (translation.length === 0 || !/\S/.test(translation)) {
      if (soundOn) playError();
      setErrorMsg('Please enter a valid translation');
    } else if (duplicateWord) {
      if (soundOn) playError();
      setErrorMsg('This word already exists in the vocabulary.')
    } else {
      let wordId = nanoid();
      while (words[wordId]) {
        wordId = nanoid();
      }
      addWord(vocabId, wordId, newWord, translation);
      addWordId(vocabId, wordId);
      toggleIsAddWord(); // to false
    }
    setErrorMsg('');
    setNewWord('');
    setTranslation('');
  }

  function cancelAddWord() {
    toggleIsAddWord(); // to false
    setNewWord('');
    setTranslation('');
    setErrorMsg('');
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      cancelAddWord();
    }
  }

  if (isAddWord) {
    return (
      <>
        <form
          className="flex w-full sm:max-w-[70%] flex-col sm:flex-row gap-3 mb-3 mt-6 justify-between items-start sm:items-end"
          onSubmit={handleAddWord}
        >
          <div className="flex flex-col sm:flex-row justify-center gap-2 w-80% sm:w-fit">
            <div className="flex flex-col gap-2">
              <Label>Word</Label>
              <input
                className="text-base sm:text-lg px-2 leading-9 border border-zinc-400 dark:border-zinc-300 dark:bg-main-bg-dark rounded-sm"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={checkForAbort}
                size={15}
                maxLength={30}
                placeholder="Enter word"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Translation</Label>
              <input
                className="text-base sm:text-lg px-2 leading-9 border border-zinc-400 dark:border-zinc-300 dark:bg-main-bg-dark rounded-sm"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                onKeyDown={checkForAbort}
                size={15}
                maxLength={30}
                placeholder="Enter translation"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="text-white bg-btn-bg hover:bg-hover-btn-bg focus:bg-hover-btn-bg px-3 py-2 rounded-sm hover:cursor-pointer"
              onClick={handleAddWord}
            >
              Create
            </button>
            <button
              className="bg-secondary-bg-light hover:bg-hover-secondary-bg focus:bg-hover-secondary-bg text-white px-3 py-2 rounded-sm hover:cursor-pointer"
              onClick={cancelAddWord}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
      </>
    )
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <button
        className="flex gap-1 items-center justify-center w-full mobile:w-3/4 rounded-lg mt-5 py-2 px-3 font-semibold text-white bg-btn-bg hover:bg-hover-btn-bg focus:bg-hover-btn-bg transition-colors disabled:text-gray-300 disabled:cursor-default hover:cursor-pointer"
        onClick={enterAddWordMode}
        disabled={!vocabId}
      >
        <HiPlus /> Add Word
      </button>
      <p className="font-bold text-lg my-3">OR</p>
      <FileForm vocabId={vocabId} vocabWordIds={vocabWords} />
    </div>
  )
}