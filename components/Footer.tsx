import { HiOutlineExternalLink } from "react-icons/hi";
import { version } from 'package.json';

export default function Footer() {
  return (
    <footer className="py-5 mobile:py-7 transition-colors bg-zinc-800 text-gray-300 text-center"
      data-testid="footer"
    >
      <div className="w-11/12 flex-col mobile:flex-row sm:w-4/5 mx-auto flex gap-3 justify-between">
        <div>
          <p className="text-xl text-center mobile:text-left">Vocab-It</p>
          <p className="text-center mobile:text-left">A web app for learning languages</p>
          <p className="text-center mobile:text-left text-sm mt-2">Developed by Michael Savych</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">References</h2>
          <ul>
            <li>Logo by <a className="underline hover:text-white transition-colors" href="https://icons8.com">Icons8</a></li>
            <li>Hero images by <a className="underline hover:text-white transition-colors" href="https://undraw.co/illustrations">unDraw</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <ul className="flex flex-col items-center mobile:items-start">
            <li>
              <a className="flex items-center gap-1 hover:text-white focus:text-white transition-colors" href="https://github.com/savvy-itch/vocab-it">
                GitHub <HiOutlineExternalLink />
              </a>
            </li>
            <li>
              <a className="flex items-center gap-1 hover:text-white focus:text-white transition-colors" href="https://www.linkedin.com/in/михайло-савич-a31366248/">
                LinkedIn <HiOutlineExternalLink />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p>©2025 Vocab-It v{version}. Developed by Michael Savych. MIT Licensed.</p>
    </footer>
  )
}