import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/site";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-200 bg-white/90 backdrop-blur">
      <div className="bg-pink-600 px-4 py-1.5 text-center text-xs font-medium text-white">
        🎀 FREE SHIPPING on orders over $50* &nbsp;·&nbsp; *$65 if the item is pink
      </div>
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-pink-600">
          <Image src="/logo.png" alt="" width={32} height={35} priority />
          {SITE_NAME}
        </Link>
        <ul className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-700">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/category/${c.slug}`} className="hover:text-pink-600">
                {c.name}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/check" className="hover:text-pink-600">Check a Link</Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-pink-600">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
