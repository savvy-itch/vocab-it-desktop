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
import { usePreferencesStore } from '@/lib/preferencesStore';
import useDisplayPopup from '@/hooks/useDisplayPopup';

export default function DangerZone() {
  const { clearProfileData } = usePreferencesStore();
  const { displayPopup } = useDisplayPopup();

  async function handleAccountDelete() {
    clearProfileData();
    displayPopup({ isError: false, msg: "Your account has been deleted" });
  }

  return (
    <section>
      <h2 className='text-xl mobile:text-2xl font-bold dark:text-custom-text-dark mb-4'>Danger zone</h2>

      <AlertDialog>
        <AlertDialogTrigger className="rounded-full bg-white mobile:bg-secondary-bg-light mobile:hover:bg-secondary-bg-light/80 mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded-sm" aria-label="delete account">
          <p className="hidden mobile:inline">Delete profile data</p>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete all your profile data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccountDelete}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
