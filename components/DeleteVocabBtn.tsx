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
import { HiTrash } from "react-icons/hi2";
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { useVocabStore } from '@/lib/vocabStore';
import { useWordStore } from '@/lib/wordStore';
import { redirect } from "react-router";

export default function DeleteVocabBtn({ id }: { id: string }) {
  const { deleteVocab } = useVocabStore(state => state);
  const { deleteAllVocabWords } = useWordStore(state => state);
  const { displayPopup } = useDisplayPopup();

  function deleteVocabFromDb() {
    deleteVocab(id);
    deleteAllVocabWords(id);
    displayPopup({ isError: false, msg: 'Vocabulary has been deleted' });
    redirect('/');
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="flex gap-1 items-center rounded-lg py-2 px-3 font-semibold text-white bg-secondary-bg-light hover:bg-hover-secondary-bg focus:bg-hover-secondary-bg transition-all hover:scale-105 hover:cursor-pointer focus:ring-2 focus:ring-red-400"
        disabled={!id}
      >
        <HiTrash /> Delete <span className="hidden mobile:inline">Vocabulary</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this vocabulary?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteVocabFromDb}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
