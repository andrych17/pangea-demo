"use client";

import { Play } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Eyebrow, Reveal } from "../motion";

/** Vertical YouTube Short, click to play. Nothing from YouTube loads until the visitor asks for it, apart from the poster image. */
export function Video({ id, title, body }: { id: string; title: string; body: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <section id="video" aria-labelledby="video-title" className="scroll-mt-20 px-4 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <Eyebrow tone="accent">60 seconds</Eyebrow>
          <h2 id="video-title" className="mt-5 font-display text-[clamp(2.4rem,4.6vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{body}</p>
        </Reveal>
        <Reveal className="md:col-span-5 md:col-start-8" delay={0.1}>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[2.2rem] bg-deep p-[7px] shadow-[0_50px_90px_-35px_rgba(30,58,95,0.65)]">
            <div className="relative h-full w-full overflow-hidden rounded-[calc(2.2rem-7px)] bg-deep">
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.iframe
                    key="player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
                    title={title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <motion.button
                    key="poster"
                    type="button"
                    exit={{ opacity: 0, scale: 1.04 }}
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 grid place-items-center"
                    aria-label={`Play video: ${title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote poster, shown before any player loads */}
                    <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full scale-[1.35] object-cover opacity-80 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:scale-[1.42]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/10 to-transparent" />
                    <span className="relative grid h-20 w-20 place-items-center rounded-full bg-accent-2 text-deep shadow-xl transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110">
                      <span className="absolute inset-0 animate-ping rounded-full bg-accent-2/40" />
                      <Play size={30} weight="fill" className="relative ms-1" />
                    </span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
