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
import { Link } from "react-router";

export default function EndLessonDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-16 text-sm mobile:text-base mobile:w-28 flex items-center justify-center rounded-lg py-2 font-semibold text-white bg-secondary-bg-light hover:bg-hover-secondary-bg hover:cursor-pointer transition-colors">
        End Lesson
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col items-center justify-center">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to end this lesson?</AlertDialogTitle>
          <AlertDialogDescription>End the lesson. All current progress will be lost.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="font-semibold bg-secondary-bg-light dark:bg-secondary-bg-light hover:bg-hover-secondary-bg dark:hover:bg-hover-secondary-bg text-white hover:text-white dark:border-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="font-semibold bg-btn-bg dark:bg-btn-bg hover:bg-hover-btn-bg dark:hover:bg-hover-btn-bg text-white dark:text-white hover:text-white border dark:border-white px-0 py-0"
          >
            <Link to={'/'} className="px-5 py-2">
              Ok
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}