import { Skeleton } from '../ui/skeleton'

export default function VocabListSkeleton() {
  return (
    <div className="w-full my-4">
      <div className="flex gap-1 px-4 my-2">
        <p className="w-2/5 font-bold text-left pl-2">Title</p>
        <p className="font-bold flex items-center gap-1 justify-start">
          Words
        </p>
      </div>
      <div className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
        <div className="flex w-full justify-between py-3 px-2">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>
        <div className="flex w-full justify-between py-3 px-2">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>
        <div className="flex w-full justify-between py-3 px-2">
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-3/5" />
        </div>
      </div>
    </div>
  )
}
