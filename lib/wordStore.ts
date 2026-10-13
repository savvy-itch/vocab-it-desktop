import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answer, OldWordLocal, WordLocal, WordLocalStore, WordsLocal } from "./types";
import { oldCalcCorrectAnswers } from "./utils";

export const useWordStore = create<WordLocalStore>()(
  persist(
    (set, get) => ({
      words: {},
      deleteWord: (wordId: string) => {
        const updatedWords = { ...get().words };
        if (updatedWords[wordId]) {
          delete updatedWords[wordId];
          set({ words: updatedWords });
        }
      },

      addWord: (vocabId: string, wordId: string, word: string, translation: string) => {
        const updatedWords = { ...get().words };

        if (!updatedWords[wordId]) {
          updatedWords[wordId] = {
            _id: wordId,
            vocabId,
            word,
            translation,
            trained: 0,
            answCor: 0
          }
          set({ words: updatedWords });
        }
      },

      editWord: (wordId: string, newWord: string, newTranslation: string) => {
        const updatedWords = { ...get().words };
        if (updatedWords[wordId]) {
          updatedWords[wordId].word = newWord;
          updatedWords[wordId].translation = newTranslation;

          set({ words: updatedWords });
        }
      },

      deleteAllVocabWords: (vocabId: string) => {
        const updatedWords = { ...get().words };
        for (const [k, v] of Object.entries(updatedWords)) {
          if (updatedWords[k].vocabId === vocabId) {
            delete updatedWords[k];
          }
        }

        set({ words: updatedWords });
      },

      updateProgress: (answers: Answer[]) => {
        const updatedWords = { ...get().words };
        answers.forEach(a => {
          const currWord = updatedWords[a._id];
          if (currWord) {
            const isGuessCorrect = currWord.word === a.userAnswer;
            if (isGuessCorrect) {
              currWord.answCor++;
            }
            currWord.trained++;
          }
        });
        set({ words: updatedWords });
      },

      addCsv: (vocabId: string, words: WordLocal[]) => {
        const updatedWords = { ...get().words };

        words.forEach(w => {
          if (w.vocabId === vocabId && w.word && w.translation) {
            updatedWords[w._id] = w;
          }
        });

        set({ words: updatedWords });
      }
    }),
    {
      name: "words",
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          const state = persistedState as {
            words: Record<string, OldWordLocal>;
          };
          
          const migratedWords: WordsLocal = Object.fromEntries(
            Object.entries(state.words).map(([key, ow]) => {
              const { progress, ...rest } = ow;
              return [
                key,
                {
                  ...rest,
                  answCor: oldCalcCorrectAnswers(ow),
                },
              ];
            })
          );
          return {
            ...state,
            words: migratedWords,
          }
        }
        return persistedState;
      }
    },
  ),
)
