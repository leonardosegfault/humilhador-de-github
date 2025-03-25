import { Github, HandCoins } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul className="p-4 w-full h-4 flex gap-8 justify-center md:justify-end font-bold text-zinc-400 select-none">
        <li>
          <Link href="https://livepix.gg/leosegfault" className="flex gap-1">
            <HandCoins /> Apoiar
          </Link>
        </li>
        <li>
          <Link
            href="https://github.com/leonardosegfault/humilhador-de-github"
            className="flex gap-1"
          >
            <Github /> GitHub
          </Link>
        </li>
      </ul>
    </nav>
  );
}
