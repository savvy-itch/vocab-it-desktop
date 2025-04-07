import { useToast } from "@/components/ui/use-toast";
import { errorSound, SOUND_VOLUME, successSound } from "@/lib/globals";
import { usePreferencesStore } from "@/lib/preferencesStore";
import useSound from "use-sound";
import { useStore } from "zustand";

function useDisplayPopup() {
  const {toast} = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  
  function displayPopup({isError, msg}: {isError: boolean, msg: string}) {
    toast({
      variant: isError ? 'destructive': 'default',
      description: msg,
      duration: 1500
    });
    if (soundOn) {
      isError ? playError() : playSuccess();
    };
  }

  return {displayPopup};
}

export default useDisplayPopup;
