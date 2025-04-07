export type LangCodes = 'FRA' | 'GER' | 'SPA' | 'default';

export interface Answer {
  _id: string,
  word: string,
  translation: string,
  userAnswer: string
}

export type CheckSingleEditFunction = () => boolean;

export interface VocabLocalStore {
  vocabs: VocabLocal[],
  deleteVocab: (id: string) => void,
  addVocab: (title: string) => void,
  editVocabTitle: (id: string, newTitle: string) => void,
  deleteWordId: (vocabId: string, wordId: string) => void,
  deleteAllWordsId: (vocabId: string) => void,
  addWordId: (vocabId: string, wordId: string) => void,
  setLang: (vocabId: string, lang: LangCodes) => void
}

export interface WordLocalStore {
  words: WordsLocal,
  deleteWord: (wordId: string) => void,
  addWord: (vocabId: string, wordId: string, word: string, translation: string) => void,
  editWord: (wordId: string, newWord: string, newTranslation: string) => void,
  deleteAllVocabWords: (vocabId: string) => void,
  updateProgress: (answers: Answer[]) => void,
  addCsv: (vocabId: string,  words: WordLocal[]) => void
}

export interface VocabLocal {
  _id: string,
  title: string,
  wordIds: string[],
  lang?: LangCodes
}

export interface WordsLocal {
  [key: string]: WordLocal
}

export interface WordLocal {
  _id: string,
  vocabId: string,
  word: string,
  translation: string,
  progress: number,
  trained: number,
  isGuessCorrect?: boolean
}

export interface ImportedWord {
  word: string;
  translation: string;
}
