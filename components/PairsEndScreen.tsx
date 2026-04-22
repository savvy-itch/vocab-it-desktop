import { Link } from 'react-router';

export default function PairsEndScreen({ vocabId, restart }: { vocabId: string, restart: Function }) {
  return (
    <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
      <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight text-center shadow-2xl">
        <h1 className="text-3xl mobile:text-3xl">Lesson complete!</h1>
        <div className="flex justify-between mt-15">
          <button
            className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white dark:bg-zinc-700 bg-zinc-600 dark:hover:bg-zinc-600 hover:bg-zinc-500 dark:focus:bg-zinc-600 focus:bg-zinc-500 hover:cursor-pointer transition-colors"
            onClick={() => restart()}
          >
            Try again
          </button>
          <Link
            className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white dark:bg-zinc-700 bg-zinc-600 dark:hover:bg-zinc-600 hover:bg-zinc-500 dark:focus:bg-zinc-600 focus:bg-zinc-500 hover:cursor-pointer transition-colors"
            to={`/vocabularies/${vocabId}`}
          >
            Back to vocab
          </Link>
          <Link
            className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white dark:bg-zinc-700 bg-zinc-600 dark:hover:bg-zinc-600 hover:bg-zinc-500 dark:focus:bg-zinc-600 focus:bg-zinc-500 hover:cursor-pointer transition-colors"
            to="/"
          >
            Back to profile
          </Link>
        </div>
      </section>
    </div>
  )
}
