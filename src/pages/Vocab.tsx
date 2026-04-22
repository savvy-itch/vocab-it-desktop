import { useVocabStore } from '@/lib/vocabStore';
import { useEffect } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import SingleWord from '@/components/SingleWord';
import VocabAddWordForm from '@/components/VocabAddWordForm';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';
import { FaShuffle } from 'react-icons/fa6';
import { MdOutlineTranslate } from "react-icons/md";

export default function Vocab() {
  const params = useParams();
  const { vocabs } = useVocabStore(state => state);
  const { words } = useWordStore(state => state);
  const {
    isAddWord,
    isEditWord,
    isEditVocabTitle,
    resetEditModes
  } = useProfileStore(state => state);

  // get words for current vocabulary
  const currVocab = vocabs.find(v => v._id === params.vocabId);
  let currWords: WordLocal[] = [];
  if (currVocab) {
    currVocab.wordIds.forEach(id => {
      currWords.push(words[id]);
    });
    currWords = currWords.filter(Boolean).sort((a, b) => a.word.localeCompare(b.word));
  }

  function checkSingleEdit() {
    if (isAddWord || isEditWord || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  function calcWordsProgress(): number {
    if (currWords.length === 0) {
      return 0;
    }
    const totalRate: number = currWords.reduce((acc, val) => acc + val.progress, 0);
    return Math.round(totalRate / currWords.length);
  }

  useEffect(() => {
    resetEditModes();
  }, [resetEditModes]);

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
          {currVocab ? (
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
        <p className="mobile:text-lg mx-auto m">Correctness rate: <span className="font-bold">{calcWordsProgress()}%</span></p>
        {currVocab && <SelectLang vocabLang={currVocab.lang} vocabId={currVocab._id} />}
        <div className="my-5 flex justify-between items-center">
          {(currWords.length > 0 && params.vocabId) ? (
            <div className="flex flex-col gap-4">
              <Link
                className="text-white rounded-lg py-2 px-3 flex gap-1 items-center font-semibold bg-btn-bg hover:bg-hover-btn-bg focus:bg-hover-btn-bg hover:scale-105 transition-all"
                to={`/lesson/${params.vocabId}`}>
                <MdOutlineTranslate /> <span>Flash Cards</span>
              </Link>
              <Link
                className="text-white rounded-lg py-2 px-3 flex gap-1 items-center font-semibold bg-btn-bg hover:bg-hover-btn-bg focus:bg-hover-btn-bg hover:scale-105 transition-all"
                to={`/lesson/pairs/${params.vocabId}`}>
                <FaShuffle /> <span>Find a Pair</span>
              </Link>
            </div>
          ) : (
            <>
              <p
                className="rounded-lg py-2 px-3 font-semibold bg-btn-bg disabled:bg-btn-bg/80 disabled:text-zinc-300 cursor-default transition-colors"
              >
                Start Lesson
              </p>
              <p
                className="rounded-lg py-2 px-3 font-semibold bg-btn-bg disabled:bg-btn-bg/80 disabled:text-zinc-300 cursor-default transition-colors"
              >
                Find a Pair
              </p>
            </>
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
          {currWords.length > 0 ? (
            <ScrollArea className="h-62.5 rounded-md border px-2 sm:px-4 py-3">
              {currWords.map((w, i) => {
                return (
                  <SingleWord
                    key={w._id}
                    word={w}
                    vocab={currVocab as VocabLocal}
                    checkSingleEdit={checkSingleEdit}
                    isLastWord={i === currWords.length - 1}
                  />
                )
              })}
            </ScrollArea>
          ) : (
            <div className="h-62.5 flex justify-center items-center rounded-md border">
              <p className="text-xl font-bold">No words</p>
            </div>
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
