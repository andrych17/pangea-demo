"use client";

import { PaperPlaneRight, Sparkle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type RefObject } from "react";
import type { ChatContent } from "@/lib/content";
import { MESSAGE_MAX, pickReply, validateMessage } from "@/lib/flows";
import { Eyebrow, Reveal, Shell } from "../motion";

type Msg = { id: string; role: "user" | "assistant"; text: string; live: boolean };

/**
 * Scripted assistant: replies come from `chat.replies` by keyword (lib/flows.ts) and stream in word by word,
 * the way an LLM answer does. No network call. Swap pickReply for a route handler that calls the
 * Claude or OpenAI API when the job needs a real one.
 */
export function Chat({ chat }: { chat: ChatContent }) {
  const id = useId();
  const [msgs, setMsgs] = useState<Msg[]>([{ id: "greeting", role: "assistant", text: chat.greeting, live: false }]);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sent = useRef(0);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length]);

  const send = (raw: string) => {
    const res = validateMessage(raw);
    if (!res.ok) {
      setError(res.error);
      inputRef.current?.focus();
      return;
    }
    setError(null);
    sent.current += 1;
    const n = sent.current;
    const answer = pickReply(res.text, chat.replies, chat.fallback);
    setMsgs((prev) => [...prev, { id: `u${n}`, role: "user", text: res.text, live: false }, { id: `a${n}`, role: "assistant", text: answer, live: true }]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send(String(new FormData(e.currentTarget).get("message") ?? ""));
  };

  return (
    <div className="px-4 pb-10 pt-28 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <Eyebrow tone="accent">Live demo</Eyebrow>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.045em]">{chat.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{chat.intro}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <Shell className="h-[620px]" inner="flex flex-col p-3 md:p-4">
              <div className="flex items-center gap-3 border-b border-ink/10 px-2 pb-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-canvas">
                  <Sparkle size={18} weight="fill" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{chat.assistant}</p>
                  <p className="text-xs text-ink-soft">Scripted demo, answers in this browser</p>
                </div>
              </div>

              <div ref={logRef} role="log" aria-live="polite" aria-label="Conversation" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-1 py-4">
                {msgs.map((m) => (
                  <motion.div key={m.id} data-msg={m.role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                    <p className={`max-w-[85%] rounded-[1.3rem] px-4 py-3 text-[15px] leading-relaxed ${m.role === "user" ? "rounded-br-md bg-ink text-canvas" : "rounded-bl-md bg-canvas ring-1 ring-ink/5"}`}>
                      {m.role === "assistant" ? <Streamed text={m.text} live={m.live} scroller={logRef} /> : m.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-3">
                {chat.suggestions.map((s) => (
                  <button key={s} type="button" data-suggestion onClick={() => send(s)} className="shrink-0 rounded-full bg-ink/[0.05] px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:bg-ink/10 hover:text-ink">
                    {s}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} noValidate>
                <div className="flex items-center gap-2 rounded-full bg-canvas p-1.5 ring-1 ring-ink/10 transition-shadow focus-within:ring-2 focus-within:ring-accent">
                  <label htmlFor={`${id}-msg`} className="sr-only">
                    Your question
                  </label>
                  <input
                    id={`${id}-msg`}
                    ref={inputRef}
                    name="message"
                    autoComplete="off"
                    maxLength={MESSAGE_MAX + 20}
                    placeholder="Ask a question"
                    aria-invalid={error !== null}
                    aria-describedby={error ? `${id}-err` : undefined}
                    className="min-w-0 flex-1 bg-transparent px-4 py-2 focus:outline-none"
                  />
                  <button type="submit" aria-label="Send" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-105 active:scale-95">
                    <PaperPlaneRight size={18} weight="bold" aria-hidden />
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p id={`${id}-err`} role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 px-4 text-sm text-accent">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </Shell>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <Shell dark inner="p-6 md:p-7">
              <p className="font-display text-2xl font-semibold tracking-tight">How the real one works</p>
              <ol className="mt-5 space-y-4">
                {chat.notes.map((note, i) => (
                  <li key={note} className="flex gap-3 text-canvas/80">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-canvas/10 text-xs">{i + 1}</span>
                    {note}
                  </li>
                ))}
              </ol>
            </Shell>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

const THINK_TICKS = 4;

/** Typing dots for a moment, then the answer word by word. Screen readers get the full text once (sr-only copy). */
function Streamed({ text, live, scroller }: { text: string; live: boolean; scroller: RefObject<HTMLDivElement | null> }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const [n, setN] = useState(live && !reduce ? -THINK_TICKS : words.length);
  const done = n >= words.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setN((v) => v + 1), n < 0 ? 150 : 28);
    return () => clearTimeout(t);
  }, [n, done]);

  useEffect(() => {
    const el = scroller.current;
    el?.scrollTo({ top: el.scrollHeight });
  }, [n, scroller]);

  return (
    <span data-done={done}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {n < 0 ? (
          <span className="inline-flex gap-1 py-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-ink-soft" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />
            ))}
          </span>
        ) : (
          words.slice(0, n).join(" ")
        )}
      </span>
    </span>
  );
}
