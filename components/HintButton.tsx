import { HiMiniLightBulb } from "react-icons/hi2";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function HintButton({ word }: { word: string }) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-center p-2 border dark:border-white rounded-sm hover:cursor-pointer" aria-label="hint button">
        <HiMiniLightBulb className="w-5 h-5" />
        </PopoverTrigger>
      <PopoverContent className="py-2 dark:border-custom-highlight dark:bg-main-bg-dark">{word}</PopoverContent>
    </Popover>
  )
}