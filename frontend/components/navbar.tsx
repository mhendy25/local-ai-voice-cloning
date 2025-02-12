import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["voice", "text", "model"];
      const mostVisible = {
        id: "",
        visibility: 0,
      };

      for (const section of sections) {
        const element = document.getElementById(`${section}-container`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementHeight = rect.height;
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(window.innerHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibility = visibleHeight / elementHeight;

          if (visibility > mostVisible.visibility) {
            mostVisible.id = section;
            mostVisible.visibility = visibility;
          }
        }
      }

      if (mostVisible.id) {
        setActiveLink(mostVisible.id);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex flex-row justify-between bg-black/80 backdrop-blur-sm p-8">
      <div id="logo-left">
        <Link href="/">
          <Image src="/logo.png" width={100} height={100} alt="logo" />
        </Link>
      </div>
      <div id="links-right" className="flex flex-row gap-2">
        <Link
          className={`${
            activeLink === "voice"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="#voice-container"
          onClick={() => setActiveLink("voice")}
        >
          Choose Voice
        </Link>
        <Link
          className={`${
            activeLink === "text"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="#text-container"
          onClick={() => setActiveLink("text")}
        >
          Choose Text
        </Link>
        <Link
          className={`${
            activeLink === "model"
              ? "text-violet-400 underline underline-offset-4"
              : "text-neutral-600 hover:text-violet-400"
          }`}
          href="#model-container"
          onClick={() => setActiveLink("model")}
        >
          Choose Model
        </Link>
      </div>
    </nav>
  );
}
