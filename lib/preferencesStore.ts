import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_AMOUNT: number = 3;

interface PreferenceStore {
  storedUsername: string,
  lessonVolume: number,
  soundOn: boolean,
  wordsPerLesson: number,
  setStoredUsername: (username: string) => void,
  updateLessonVolume: (newVolume: number) => void,
  toggleSoundOn: () => void,
  setWordsPerLesson: (n: number) => void
  clearProfileData: () => void
}

export const usePreferencesStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      storedUsername: 'vocab-it user',
      lessonVolume: INITIAL_AMOUNT,
      soundOn: true,
      wordsPerLesson: 20,
      setStoredUsername: (username: string) => set({ storedUsername: username }),
      updateLessonVolume: (newVolume: number) => set({ lessonVolume: newVolume }),
      toggleSoundOn: () => set((state: PreferenceStore) => ({ soundOn: !state.soundOn })),
      setWordsPerLesson: (n) => set({ wordsPerLesson: n }),
      clearProfileData: () => {
        localStorage.removeItem('vocab-preferences');
        localStorage.removeItem('vocabs');
        localStorage.removeItem('words');
        set({
          storedUsername: '',
          lessonVolume: INITIAL_AMOUNT,
          soundOn: true,
          wordsPerLesson: 20,
        });
      }
    }),
    {
      name: "vocab-preferences",
    }
  ),
);