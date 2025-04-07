import React, { useEffect, useState } from 'react';
import type { VocabLocal } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import useSound from 'use-sound';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';

import { HiPencilSquare, HiTrash, HiCheckCircle, HiMiniXCircle } from "react-icons/hi2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SOUND_VOLUME, errorSound } from '@/lib/globals';
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { useVocabStore } from '@/lib/vocabStore';
import { Link } from 'react-router';

export default function VocabListRow({ vocab }: { vocab: VocabLocal }) {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(vocab.title);
  const { vocabs, deleteVocab, editVocabTitle } = useVocabStore(state => state);
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isEditVocabTitle,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const { displayPopup } = useDisplayPopup();

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  function enterEditTitleMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      setIsEditTitle(true);
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  async function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      if (soundOn) playError();
      alert('Enter valid title');
    }
    // if there's an existing vocab with new title
    else if (vocabs?.some(v => v._id !== vocab._id && v.title === title)) {
      if (soundOn) playError();
      alert('A vocabulary with this title already exists');
    } else {
      editVocabTitle(vocab._id, title);
      setIsEditTitle(false);
      displayPopup({ isError: false, msg: "Vocabulary title has been updated" });
    }
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setTitle(vocab.title);
      setIsEditTitle(false);
    }
  }

  function deleteVocabFromStorage() {
    deleteVocab(vocab._id);
    displayPopup({ isError: false, msg: "Vocabulary has been deleted" });
  }

  useEffect(() => {
    if (isEditTitle) {
      if (!isEditVocabTitle) {
        toggleIsEditVocabTitle();
      }
    } else {
      if (isEditVocabTitle) {
        toggleIsEditVocabTitle();
      }
    }
  }, [isEditTitle])

  return (
    <article>
      <div className="flex items-center gap-1 py-3 px-2 rounded-md dark:border-main-bg-dark hover:bg-slate-100 dark:hover:bg-custom-highlight2 transition-colors">
        {isEditTitle ? (
          <>
            <div className="w-2/5">
              <form onSubmit={updateTitle}>
                <input
                  className="leading-8 px-2 rounded-sm dark:bg-main-bg-dark border border-zinc-400 dark:border-zinc-300"
                  type="text"
                  value={title}
                  size={10}
                  maxLength={15}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={checkForAbort}
                  autoFocus
                />
              </form>
            </div>
            <div className="w-10 text-center">{vocab.wordIds ? vocab.wordIds.length : 0}</div>
            <div className="flex gap-2 justify-around grow">
              <button
                className="rounded-full bg-white mobile:bg-btn-bg mobile:hover:bg-hover-btn-bg hover:cursor-pointer mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
                aria-label="save"
                onClick={updateTitle}
              >
                <p className="hidden mobile:inline">Save</p>
                <HiCheckCircle className="inline mobile:hidden text-btn-bg hover:text-hover-btn-bg h-8 w-8" />
              </button>
              <button
                className="rounded-full bg-white mobile:bg-secondary-bg-light mobile:hover:bg-secondary-bg-light/80 hover:cursor-pointer mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm"
                aria-label="cancel"
                onClick={() => setIsEditTitle(false)}
              >
                <p className="hidden mobile:inline">Cancel</p>
                <HiMiniXCircle className="inline mobile:hidden text-secondary-bg-light hover:text-secondary-bg-light/80 h-8 w-8" />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="w-2/5">
              <Link
                to={`/vocabularies/${vocab._id}`}
                className="underline hover:text-custom-text-light/80 dark:hover:text-custom-text-dark/80 sm:text-lg"
              >
                {vocab.title}
              </Link>
            </p>
            <p className="w-10 text-center">{vocab.wordIds ? vocab.wordIds.length : 0}</p>
            <div className="grow flex gap-1 justify-around">
              {vocab.wordIds.length > 0 ? (
                <Link
                  className="text-white text-sm sm:text-lg rounded-sm bg-btn-bg hover:bg-hover-btn-bg transition-colors py-1 px-3"
                  to={`/lesson/${vocab._id}`}
                >
                  Start <span className="hidden sm:inline">Lesson</span>
                </Link>
              ) : (
                <p className="text-sm sm:text-lg rounded-sm bg-btn-bg hover:bg-hover-btn-bg transition-colors py-1 px-3 text-gray-300">Start <span className="hidden sm:inline">Lesson</span></p>
              )}
              <div className="flex gap-4">
                <button className="text-lg hover:cursor-pointer" aria-label="edit" onClick={enterEditTitleMode}><HiPencilSquare /></button>
                <AlertDialog>
                  <AlertDialogTrigger className="text-lg hover:cursor-pointer" aria-label="delete">
                    <HiTrash />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this vocabulary?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteVocabFromStorage}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </>
        )}
      </div>
      {/* separator */}
      {vocabs && vocabs[vocabs.length - 1]._id !== vocab._id && <div className="h-px w-full dark:bg-main-bg-dark" />}
    </article>
  )
}