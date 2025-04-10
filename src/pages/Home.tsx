import useProfileStore from "@/lib/profileStore";
import { useEffect } from "react";
import ProfileUsernameSection from "@/components/ProfileUsernameSection";
import ProfileAddVocabSection from "@/components/ProfileAddVocabSection";
import ProfileWordSection from "@/components/ProfileWordSection";
import DangerZone from "@/components/DangerZone";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

export default function Home() {
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isEditVocabTitle,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
      case isEditWordAmount:
        toggleIsEditWordAmount();
      case isAddVocab:
        toggleIsAddVocab();
      case isEditVocabTitle:
        toggleIsEditVocabTitle();
    }
  }, []);

  return (
    <>
      <section className="w-full mobile:w-11/12 lg:w-3/5 mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <h1 className='text-2xl mobile:text-3xl md:text-3xl text-center font-semibold dark:text-custom-text-dark mb-4'>Profile</h1>
        <ProfileUsernameSection checkSingleEdit={checkSingleEdit} />
        <ProfileAddVocabSection checkSingleEdit={checkSingleEdit} />
        <ProfileWordSection checkSingleEdit={checkSingleEdit} />
        <DangerZone />
      </section>
      <Toaster />
      <Footer />
    </>
  )
}
