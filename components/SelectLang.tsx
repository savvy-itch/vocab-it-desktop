import { specialSymbols } from '@/lib/globals'
import React, { useEffect, useState } from 'react';
import useDisplayPopup from '@/hooks/useDisplayPopup';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import CustomTooltip from './CustomTooltip';
import { useVocabStore } from '@/lib/vocabStore';
import type { LangCodes, VocabLocal } from '@/lib/types';

export default function SelectLang({ vocab }: { vocab: VocabLocal}) {
  const { setLang } = useVocabStore(state => state);
  const { displayPopup } = useDisplayPopup();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LangCodes>();

  function handleLangChange(updatedLang: LangCodes) {
    if (updatedLang !== selectedLang) {
      setSelectedLang(updatedLang);

      if (updatedLang === 'default' || Object.keys(specialSymbols).includes(updatedLang)) {
        setIsUpdating(true);
        setLang(vocab._id, updatedLang);
        displayPopup({ isError: false, msg: "Language has been updated" });
        setIsUpdating(false);
      }
    }
  };

  useEffect(() => {
    if (vocab.lang) {
      setSelectedLang(vocab.lang)
    }
  }, []);

  return (
    <section className="w-full flex items-start mx-auto gap-2 my-3">
      <Select
        value={selectedLang}
        onValueChange={handleLangChange}
        disabled={isUpdating}
        name="langs"
      >
        <SelectTrigger aria-label="Select language" className="w-3/4 mobile:w-[180px] bg-white dark:border-custom-highlight dark:bg-main-bg-dark border border-slate-200">
          <SelectValue aria-label="Select language" placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="dark:border-custom-highlight dark:bg-main-bg-dark">
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            <SelectItem className="text-custom-text-light dark:text-white hover:bg-slate-300 dark:hover:bg-custom-highlight focus:bg-slate-200 focus:text-slate-900 dark:focus:bg-custom-highlight" value="default">No language</SelectItem>
            {Object.keys(specialSymbols).map(lang => {
              return <SelectItem className="text-custom-text-light dark:text-white hover:bg-slate-300 dark:hover:bg-custom-highlight focus:bg-slate-200 focus:text-slate-900 dark:focus:bg-custom-highlight" value={lang} key={lang}>{lang}</SelectItem>
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <CustomTooltip text="Selecting a language will display a keyboard of special symbols during lessons" />
    </section>
  )
}
