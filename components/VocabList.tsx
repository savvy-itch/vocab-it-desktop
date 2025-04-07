import { useState } from 'react';
import type { VocabLocal } from '@/lib/types';
import VocabListRow from './VocabListRow';
import { ScrollArea } from './ui/scroll-area';
import VocabListSkeleton from './skeletons/VocabListSkeleton';
import { useVocabStore } from '@/lib/vocabStore';

export default function VocabList() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const vocabs = useVocabStore(state => state.vocabs);

  if (isLoading) {
    return <VocabListSkeleton />;
  }

  if (vocabs && vocabs.length > 0) {
    return (
      <section className="w-full my-4">
        <div className="flex gap-1 px-4 my-2">
          <p className="w-2/5 font-bold text-left pl-2">Title</p>
          <p className="font-bold flex items-center gap-1 justify-start">
            Words
          </p>
        </div>
        <ScrollArea className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
          {vocabs.map((vocab: VocabLocal) => {
            return <VocabListRow key={vocab._id} vocab={vocab} />
          })}
        </ScrollArea>
      </section>
    )
  }

  return (
    <section className="my-4">
      <div className="flex gap-1 px-4 my-2">
        <p className="w-2/5 font-bold text-left pl-2">Title</p>
        <p className="font-bold flex items-center gap-1 justify-start">
          Words
        </p>
      </div>
      <div className="h-[210px] rounded-md border sm:px-4 py-3 flex justify-center items-center">
        <p className="text-base sm:text-xl font-bold">No vocabularies</p>
      </div>
    </section>
  )
}