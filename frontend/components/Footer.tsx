"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { transitionSpringSoft } from "@/lib/motion/constants";

const linkTap = {
  whileTap: { scale: 0.97 },
  transition: transitionSpringSoft,
} as const;

export function Footer() {
  return (
    <footer className="bg-deep-obsidian w-full py-16 border-t border-white/15">
      <div className="max-w-7xl mx-auto px-12 flex flex-col items-center gap-8 text-center">
        <div className="font-headline text-lg tracking-widest text-white uppercase font-bold">
          SUNSHINE HOTEL
        </div>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {(
            [
              ["Privacy", "/"],
              ["Terms", "/"],
              ["Social", "/"],
              ["Contact", "/"],
            ] as const
          ).map(([label, href]) => (
            <motion.span key={label} className="inline-flex" {...linkTap}>
              <Link
                href={href}
                className="font-headline italic text-base text-white/80 hover:text-primary-fixed underline-offset-4 transition-colors duration-300"
              >
                {label}
              </Link>
            </motion.span>
          ))}
        </div>
        <div className="pt-8 border-t border-white/15 w-full text-white/70 font-label text-xs tracking-widest uppercase">
          © 2026 Sunshine Hotel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
