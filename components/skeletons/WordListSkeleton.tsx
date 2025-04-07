import { Skeleton } from '../ui/skeleton'

export default function WordListSkeleton() {
  return (
    <div className="h-[250px] rounded-md border px-2 sm:px-4 py-3">
      <article className="flex justify-between my-1 p-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </article>
      <article className="flex justify-between my-1 p-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </article>
      <article className="flex justify-between my-1 p-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </article>
      <article className="flex justify-between my-1 p-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </article>
    </div>
  )
}
