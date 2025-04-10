import { useVocabStore } from '@/lib/vocabStore';
import { useEffect, useState } from 'react';
import type { VocabLocal, WordLocal } from '@/lib/types';
import { useWordStore } from '@/lib/wordStore';
import useProfileStore from '@/lib/profileStore';
import { Link, useParams } from 'react-router';
import { HiArrowLongLeft } from 'react-icons/hi2';
import VocabTitleSection from '@/components/VocabTitleSection';
import { Skeleton } from '@/components/ui/skeleton';
import SelectLang from '@/components/SelectLang';
import DeleteVocabBtn from '@/components/DeleteVocabBtn';
import DeleteWordsBtn from '@/components/DeleteWordsBtn';
import WordListSkeleton from '@/components/skeletons/WordListSkeleton';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import SingleWord from '@/components/SingleWord';
import VocabAddWordForm from '@/components/VocabAddWordForm';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';

export default function Vocab() {
  let params = useParams();
  const { vocabs } = useVocabStore(state => state);
  const [currVocab, setCurrVocab] = useState<VocabLocal>();
  const { words } = useWordStore(state => state);
  const [currWords, setCurrWords] = useState<WordLocal[]>([]);
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isAddWord,
    isEditWord,
    isEditVocabTitle,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsAddWord,
    toggleIsEditWord,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);
  const [isLoading, setIsLoading] = useState(false);

  function checkSingleEdit() {
    if (isAddWord || isEditWord || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setIsLoading(true);
    const existingVocab = vocabs.find(v => v._id === params.vocabId);
    if (existingVocab) {
      setCurrVocab(existingVocab);
      let existingWords: WordLocal[] = [];
      existingVocab.wordIds.forEach(id => {
        existingWords.push(words[id]);
      });
      existingWords = existingWords.filter(Boolean);
      setCurrWords(existingWords);
    }
    setIsLoading(false);
  }, [params.vocabId, words, vocabs]);

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
      case isEditWordAmount:
        toggleIsEditWordAmount();
      case isAddVocab:
        toggleIsAddVocab();
      case isAddWord:
        toggleIsAddWord();
      case isEditWord:
        toggleIsEditWord();
      case isEditVocabTitle:
        toggleIsEditVocabTitle();
    }
  }, []);

  return (
    <>
      <section className="w-full mobile:w-11/12 lg:w-3/5 mx-auto mb-6 py-5 px-4 sm:px-8 rounded-3xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight flex flex-col border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <div className="grid grid-rows-2 sm:grid-cols-3 gap-3 w-full items-start">
          <Link
            className="w-fit flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-custom-highlight2 focus:bg-slate-100 dark:focus:bg-custom-highlight2 border border-zinc-400 dark:border-zinc-300"
            to="/"
          >
            <HiArrowLongLeft /> Profile
          </Link>
          {!isLoading && currVocab ? (
            <VocabTitleSection
              id={currVocab._id}
              vocabTitle={currVocab.title}
              checkSingleEdit={checkSingleEdit}
            />
          ) : (
            <Skeleton className="justify-self-center block h-8 w-2/3 mobile:h-9 md:h-10" />
          )}
        </div>

        <div className="w-full flex gap-2 justify-center items-start">
          <p className="mobile:text-lg">
            {currWords.length === 1 ? '1 word' : `${currWords.length} words`}
          </p>
        </div>
        {currVocab && <SelectLang vocab={currVocab} />}
        <div className="my-5 flex justify-between items-center">
          {(currWords.length > 0 && params.vocabId) ? (
            <Link
              className="text-white rounded-lg py-2 px-3 font-semibold bg-btn-bg hover:bg-hover-btn-bg focus:bg-hover-btn-bg transition-colors"
              to={`/lesson/${params.vocabId}`}>
              Start Lesson
            </Link>
          ) : (
            <p
              className="rounded-lg py-2 px-3 font-semibold bg-btn-bg disabled:bg-btn-bg/80 disabled:text-zinc-300 cursor-default transition-colors"
            >
              Start Lesson
            </p>
          )}
          <div className="flex flex-col gap-4">
            {currVocab && (
              <>
                <DeleteVocabBtn id={currVocab._id} />
                <DeleteWordsBtn id={currVocab._id} wordsExist={currWords.length > 0} />
              </>
            )}
          </div>
        </div>
        <section className="w-full mx-auto">
          <div className="flex justify-between mobile:px-6 my-2">
            <p className="text-sm sm:text-base font-bold sm:w-1/3">Word</p>
            <p className="text-sm sm:text-base font-bold">Translation</p>
            <p className="text-sm sm:text-base font-bold">Progress</p>
          </div>
          {isLoading
            ? <WordListSkeleton />
            : (
              currWords.length > 0 ? (
                <ScrollArea className="h-[250px] rounded-md border px-2 sm:px-4 py-3 overflow-y-auto">
                  {currWords.map(w => {
                    return (
                      <SingleWord
                        key={w._id}
                        word={w}
                        vocab={currVocab as VocabLocal}
                        checkSingleEdit={checkSingleEdit}
                      />
                    )
                  })}
                </ScrollArea>
              ) : (
                <div className="h-[250px] flex justify-center items-center rounded-md border">
                  <p className="text-xl font-bold">No words</p>
                </div>
              )
            )
          }
        </section>
        {currVocab && <VocabAddWordForm vocabWords={currVocab.wordIds} vocabId={currVocab._id} checkSingleEdit={checkSingleEdit} />}
      </section>
      <Toaster />
      <Footer />
    </>
  )
}
