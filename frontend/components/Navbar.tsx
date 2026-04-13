"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { PAGE_SECTION_IDS } from "@/lib/constants/page-sections";
import { useHash } from "@/hooks/use-hash";
import { MotionButton } from "@/components/ui/motion-button";
import { transitionSpringSoft } from "@/lib/motion/constants";

function navTextClass(active: boolean) {
  return active
    ? "text-primary-fixed font-semibold font-headline text-sm md:text-base tracking-tight transition-colors duration-300 whitespace-nowrap"
    : "text-white/80 hover:text-primary-fixed font-headline text-sm md:text-base tracking-tight transition-colors duration-300 whitespace-nowrap";
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const hash = useHash();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const onHome = pathname === "/";

  const homeActive =
    onHome && (hash === "" || hash === `#${PAGE_SECTION_IDS.hero}`);
  const roomsNavActive =
    (onHome && hash === `#${PAGE_SECTION_IDS.collection}`) ||
    pathname === "/rooms";
  const bookingsActive = pathname === "/bookings";
  const adminActive = pathname.startsWith("/admin");

  const navTap = {
    whileTap: { scale: 0.97 },
    transition: transitionSpringSoft,
  } as const;

  return (
    <nav className="fixed top-0 w-full z-50 px-2 md:px-6 pt-2">
      <div className="h-16 md:h-[72px] px-4 md:px-8 flex justify-between items-center gap-3 rounded-xl bg-[#071426]/78 border border-white/15 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <motion.span className="inline-flex shrink-0" {...navTap}>
          <Link
            href="/"
            className="font-headline text-lg md:text-2xl font-bold tracking-widest text-white uppercase"
          >
            SUNSHINE HOTEL
          </Link>
        </motion.span>

        <div className="hidden md:flex flex-1 min-w-0 justify-center items-center gap-8 overflow-x-auto no-scrollbar py-1">
          {onHome ? (
            <motion.span className="inline-flex shrink-0" {...navTap}>
              <a
                href={`#${PAGE_SECTION_IDS.hero}`}
                className={navTextClass(homeActive)}
              >
                Home
              </a>
            </motion.span>
          ) : (
            <motion.span className="inline-flex shrink-0" {...navTap}>
              <Link href="/" className={navTextClass(false)}>
                Home
              </Link>
            </motion.span>
          )}
          {onHome ? (
            <motion.span className="inline-flex shrink-0" {...navTap}>
              <a
                href={`#${PAGE_SECTION_IDS.collection}`}
                className={navTextClass(roomsNavActive)}
              >
                Rooms
              </a>
            </motion.span>
          ) : (
            <motion.span className="inline-flex shrink-0" {...navTap}>
              <Link href="/rooms" className={navTextClass(roomsNavActive)}>
                Rooms
              </Link>
            </motion.span>
          )}
          <motion.span className="inline-flex shrink-0" {...navTap}>
            <Link href="/bookings" className={navTextClass(bookingsActive)}>
              My Bookings
            </Link>
          </motion.span>
          <motion.span className="inline-flex shrink-0" {...navTap}>
            <Link href="/admin" className={navTextClass(adminActive)}>
              Admin
            </Link>
          </motion.span>
        </div>

        <div className="hidden md:block">
          <MotionButton
            type="button"
            variant="nav"
            size="md"
            onClick={() => router.push("/rooms")}
            className="shrink-0 px-7 py-2 text-sm tracking-wide bloom-effect rounded-lg bg-primary text-white hover:brightness-110"
          >
            Book Now
          </MotionButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-md border border-white/25 text-white"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-2 border border-white/15 rounded-xl px-4 pb-4 pt-3 bg-[#071426]/92 backdrop-blur-xl space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label text-sm text-white/90"
          >
            Home
          </Link>
          <Link
            href="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label text-sm text-white/90"
          >
            Rooms
          </Link>
          <Link
            href="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label text-sm text-white/90"
          >
            My Bookings
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label text-sm text-white/90"
          >
            Admin
          </Link>
          <MotionButton
            type="button"
            variant="nav"
            size="md"
            onClick={() => {
              setMobileMenuOpen(false);
              router.push("/rooms");
            }}
            className="w-full mt-1 rounded-lg"
          >
            Book Now
          </MotionButton>
        </div>
      )}
    </nav>
  );
}
