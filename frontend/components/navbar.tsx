import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [activeLink, setActiveLink] = useState("/");

  return (
    <nav className="flex flex-row justify-between bg-black p-4">
      <div id="logo-left">
        <Link href="/">
          <Image src="/logo.png" width={100} height={100} alt="logo" />
        </Link>
      </div>
      <div id="links-right" className="flex flex-row gap-2">
        <Link
          className={`${
            activeLink === "/"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="/"
          onClick={() => setActiveLink("/")}
        >
          Choose Voice
        </Link>
        <Link
          className={`${
            activeLink === "/about"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="/about"
          onClick={() => setActiveLink("/about")}
        >
          Choose Text
        </Link>
        <Link
          className={`${
            activeLink === "/contact"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="/contact"
          onClick={() => setActiveLink("/contact")}
        >
          Choose Model
        </Link>
      </div>
    </nav>
  );
}
