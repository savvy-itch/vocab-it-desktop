import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LangCodes, VocabLocal, VocabLocalStore } from "./types";
import { nanoid } from "nanoid";

export const useVocabStore = create<VocabLocalStore>()(
  persist(
    (set, get) => ({
      vocabs: [],

      deleteVocab: (id: string) => {
        set({ vocabs: get().vocabs.filter(v => v._id !== id) });
      },

      addVocab: (title: string) => {
        let vocabId = nanoid();

        while(get().vocabs.find(v => v._id === vocabId)) {
          vocabId = nanoid();
        }

        const newVocab: VocabLocal = {
          _id: vocabId,
          title,
          wordIds: []
        };
        set({ vocabs: [...get().vocabs, newVocab] });
      },

      editVocabTitle: (id: string, newTitle: string) => {
        const updatedVocabs = get().vocabs.map(v => v._id === id
          ? { ...v, title: newTitle }
          : v
        );
        set({ vocabs: updatedVocabs });
      },

      deleteWordId: (vocabId: string, wordId: string) => {
        const updatedVocabs = get().vocabs.map(v => v._id === vocabId
          ? { ...v, wordIds: v.wordIds.filter(w => w !== wordId) }
          : v
        );
        set({ vocabs: updatedVocabs });
      },

      deleteAllWordsId: (vocabId: string) => {
        const updatedVocabs = get().vocabs.map(v => v._id === vocabId
          ? { ...v, wordIds: [] }
          : v
        );
        set({ vocabs: updatedVocabs });
      },

      addWordId: (vocabId: string, wordId: string) => {
        const updatedVocabs = get().vocabs.map(v => v._id === vocabId
          ? { ...v, words: v.wordIds.push(wordId) }
          : v
        );
        set({ vocabs: updatedVocabs });
      },

      setLang: (vocabId: string, lang: LangCodes) => {
        const updatedVocabs = get().vocabs.map(v => v._id === vocabId
          ? { ...v, lang }
          : v
        );
        set({ vocabs: updatedVocabs });
      }
    }),
    {
      name: "vocabs",
    }
  ),
)
