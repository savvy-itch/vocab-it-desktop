import { create } from "zustand";

interface ProfileSlice {
  isEditUsername: boolean,
  isEditWordAmount: boolean,
  isAddVocab: boolean,
  isAddWord: boolean,
  isEditWord: boolean,
  isEditVocabTitle: boolean,
  isEditRoundsAmount: boolean,
  toggleIsEditUsername: () => void,
  toggleIsEditWordAmount: () => void,
  toggleIsAddVocab: () => void,
  toggleIsAddWord: () => void,
  toggleIsEditWord: () => void,
  toggleIsEditVocabTitle: () => void,
  toggleIsEditRoundsAmount: () => void,
  resetEditModes: () => void,
}

const useProfileStore = create<ProfileSlice>()(set => ({
  isEditUsername: false,
  isEditWordAmount: false,
  isAddVocab: false,
  isAddWord: false,
  isEditWord: false,
  isEditVocabTitle: false,
  isEditRoundsAmount: false,
  toggleIsEditUsername: () => set(state => ({ isEditUsername: !state.isEditUsername })),
  toggleIsEditWordAmount: () => set(state => ({ isEditWordAmount: !state.isEditWordAmount })),
  toggleIsAddVocab: () => set(state => ({ isAddVocab: !state.isAddVocab })),
  toggleIsAddWord: () => set(state => ({ isAddWord: !state.isAddWord })),
  toggleIsEditWord: () => set(state => ({ isEditWord: !state.isEditWord })),
  toggleIsEditVocabTitle: () => set(state => ({ isEditVocabTitle: !state.isEditVocabTitle })),
  toggleIsEditRoundsAmount: () => set(state => ({ isEditRoundsAmount: !state.isEditRoundsAmount })),
  resetEditModes: () => set(() => ({
    isEditUsername: false,
    isEditWordAmount: false,
    isAddVocab: false,
    isEditVocabTitle: false,
    isEditRoundsAmount: false,
  }))
}));

export default useProfileStore;