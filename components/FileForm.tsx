import React, { useRef, useState } from 'react';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { SOUND_VOLUME, errorSound } from '@/lib/globals';
import useSound from 'use-sound';
import { Label } from './ui/label';
import { HiDocumentText } from "react-icons/hi2";
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { useWordStore } from '@/lib/wordStore';
import { useVocabStore } from '@/lib/vocabStore';
import type { ImportedWord, WordLocal } from '@/lib/types';
import { nanoid } from 'nanoid';

export default function FileForm({ vocabId, vocabWordIds }: { vocabId: string, vocabWordIds: string[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const { words, addCsv } = useWordStore(state => state);
  const { addWordId } = useVocabStore(state => state);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [filePreview, setFilePreview] = useState<string>('No file selected');
  const [isSelectFile, setIsSelectFile] = useState<boolean>(false);
  const { displayPopup } = useDisplayPopup();

  function displayFileInfo(e: React.SyntheticEvent) {
    e.preventDefault();

    if (inputRef.current) {
      const files = inputRef.current.files;
      if (files && files.length > 0) {
        const file = files[0];
        // if the file type isn't .txt or .csv
        if (file.type !== 'text/plain' && file.type !== 'text/csv') {
          if (soundOn) playError();
          alert('Please choose .txt/.csv file');
          return;
        }
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target) {
            const importWords: ImportedWord[] = [];
            const fileContent = event.target.result as string;

            if (fileContent.length === 0) return;

            let startIdx = 0;

            for (let i = 1; i < fileContent.length; i++) {
              // if it's a separator
              if (fileContent[i] === ';' || fileContent[i] === ',') {
                // if a word was provided without translation
                if (fileContent[i + 1] === "\r" && fileContent[i + 2] === "\n") {
                  // move to the next line
                  startIdx = i + 3;
                  i += 2;
                } else {
                  // if it's a valid word
                  let wordStr = fileContent.substring(startIdx, i);
                  const wordObj = { word: wordStr, translation: '' };
                  importWords.push(wordObj);
                  // if file uses incorrect indentation (', ')
                  (fileContent[i + 1] === ' ') ? startIdx = i + 2 : startIdx = i + 1;
                }
              } else if (fileContent[i] === "\n") {
                // if it's the end of the line
                let translationStr = fileContent.substring(startIdx, i - 1);
                // if no valid translation, remove last word object
                importWords[importWords.length - 1].translation = translationStr;
                startIdx = i + 1;
              } else if (i === fileContent.length - 1) {
                let translationStr = fileContent.substring(startIdx, i + 1);
                importWords[importWords.length - 1].translation = translationStr;
              }
            }
            checkForDuplicateWords(importWords);
          }
        }
        reader.readAsText(file);
      }
    }
  }

  function checkForDuplicateWords(importWords: ImportedWord[]) {
    const wordSet = new Set();
    const uniqueWords: WordLocal[] = [];
    for (const word of importWords) {
      // if there's no duplicates in the file and in the store
      if (!wordSet.has(word.word) && !vocabWordIds.some(id => words[id].word === word.word)) {
        wordSet.add(word.word);
        let wordId = nanoid();
        while (words[wordId]) {
          wordId = nanoid();
        }
        uniqueWords.push({ ...word, _id: wordId, vocabId, progress: 0, trained: 0 });
      }
    }
    if (uniqueWords.length > 0) {
      addCsv(vocabId, uniqueWords);
      uniqueWords.forEach(w => {
        addWordId(vocabId, w._id);
      });
      displayPopup({ isError: false, msg: "Words from file have been imported" });
    }
  }

  function displayFileName() {
    if (inputRef.current) {
      const files = inputRef.current.files;
      if (files && files.length > 0) {
        setFilePreview(files[0].name);
        setIsSelectFile(true);
      }
    }
  }

  return (
    <form
      className="w-full mobile:w-3/4 xl:w-1/2 flex flex-col justify-center items-center font-sans px-1 py-2 rounded-md border-2 border-zinc-400 dark:border-zinc-300"
      onSubmit={displayFileInfo}
    >
      <p className="text-lg mt-1">Import a <span className="font-mono font-semibold">.txt/.csv</span> file</p>
      <p className="mb-3">(in the form &#34;word,translation&#34;)</p>
      <Label
        className="w-full mobile:w-2/3 text-center text-base text-white p-2 rounded-sm bg-zinc-700 hover:bg-zinc-800 hover:cursor-pointer transition-colors"
        htmlFor="words-file"
      >
        Choose file
      </Label>
      <input
        className="opacity-0 h-0"
        ref={inputRef}
        id="words-file"
        name="words file"
        type="file"
        accept=".txt, .csv"
        onChange={displayFileName}
      />
      <p className="my-3 italic flex justify-center items-center gap-1 w-80 max-w-[90%] overflow-hidden">{isSelectFile && <HiDocumentText />} {filePreview}</p>
      <button
        className="w-full mobile:w-auto text-center text-base text-white font-semibold py-2 px-5 rounded-sm bg-zinc-700 hover:bg-zinc-800 hover:cursor-pointer disabled:cursor-default disabled:bg-zinc-600 disabled:text-zinc-300 transition-colors"
        type="submit"
        onSubmit={displayFileInfo}
        disabled={!isSelectFile}
      >
        Submit
      </button>
    </form>
  )
}