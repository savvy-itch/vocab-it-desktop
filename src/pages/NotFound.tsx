import { Link } from 'react-router';

export default function NotFound () {
  return (
    <>
      <section className="w-11/12 lg:w-3/5 flex flex-col gap-4 items-center justify-center mx-auto mb-10 py-5 px-4 sm:px-8 rounded-3xl bg-white text-custom-text-light dark:text-custom-text-dark dark:bg-custom-highlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <img
          src="./images/404.svg"
          alt="404 error"
        />
        <h1 className="text-2xl text-center">This page could not be found :(</h1>
        <Link
          className="text-xl font-bold py-3 px-8 bg-custom-highlight3 hover:bg-custom-highlight3/80 rounded-xl" 
          to="/"
        >
          Home
        </Link>
      </section>
    </>
  )
}
