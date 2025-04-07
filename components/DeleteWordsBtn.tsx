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
import { TbLetterCase } from "react-icons/tb";
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';

export default function DeleteWordsBtn({ id, wordsExist }: { id: string, wordsExist: boolean }) {
  const { vocabs, deleteAllWordsId } = useVocabStore(state => state);
  const { deleteAllVocabWords } = useWordStore(state => state);

  function deleteVocabFromStorage() {
    deleteAllWordsId(id);
    deleteAllVocabWords(id);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger 
        className="flex gap-1 items-center rounded-lg py-2 px-3 font-semibold text-white bg-secondary-bg-light hover:bg-hover-secondary-bg hover:cursor-pointer focus:bg-hover-secondary-bg disabled:bg-secondary-bg-light/50 disabled:hover:cursor-not-allowed transition-all hover:scale-105 focus:ring-2 focus:ring-red-400"
        disabled={!wordsExist}
      >
        <TbLetterCase /> Delete <span className="hidden mobile:inline"> All Words</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete all words from this vocabulary?</AlertDialogTitle>
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
  )
}
