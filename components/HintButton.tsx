import { HiMiniLightBulb } from "react-icons/hi2";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HintProps {
  word: string, 
  hintType: HintType
};

type HintType = 'letter' | 'word';

export default function HintButton({ word, hintType }: HintProps) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center p-2 border dark:border-white rounded-sm hover:cursor-pointer" aria-label="hint button" title={hintType === 'letter' ? "Show first letter" : "Show translation"}>
        {hintType === 'letter'
        ? <RxLetterCaseCapitalize className="w-5 h-5" />
        : <HiMiniLightBulb className="w-5 h-5" />
        }
      </PopoverTrigger>
      <PopoverContent className="py-2 dark:border-custom-highlight dark:bg-main-bg-dark">
        {hintType === 'word'
        ? word
        : word[0] + word.substring(1).replaceAll(/./g, '•')
        }
      </PopoverContent>
    </Popover>
  )
}