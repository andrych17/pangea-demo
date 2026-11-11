"use client";

import { CheckCircle, EnvelopeSimple, MapPin } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { validateContact, type ContactErrors } from "@/lib/contact";
import { CONTACT_TOPICS } from "@/lib/pangea";

const FIELD = "mt-2 w-full rounded-2xl bg-canvas px-4 py-3 text-base outline-none ring-1 ring-ink/10 transition-shadow placeholder:text-ink-soft/60 focus-visible:ring-2 focus-visible:ring-accent aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-accent-2";

/**
 * Contact form with inline validation, a honeypot and a sent state.
 * Demo: nothing is sent. The real site posts to Netlify Forms (name="contact", data-netlify) with no backend.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("company")) return; // honeypot: bots fill it, people never see it
    const { errors: errs } = validateContact({ name: String(f.get("name") ?? ""), email: String(f.get("email") ?? ""), topic: String(f.get("topic") ?? ""), message: String(f.get("message") ?? "") });
    setErrors(errs);
    const first = (["name", "email", "topic", "message"] as const).find((k) => errs[k]);
    if (first) {
      const el = form.current?.elements.namedItem(first);
      if (el instanceof HTMLElement) el.focus();
      return;
    }
    setSent(true);
  }

  return (
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 md:px-10 lg:grid-cols-12">
      <aside className="flex flex-col gap-4 lg:col-span-4">
        <div className="rounded-[2rem] bg-deep p-7 text-canvas">
          <p className="text-[11px] uppercase tracking-[0.2em] text-canvas/50">Contact us</p>
          <p className="mt-3 font-display text-2xl font-semibold leading-tight">We aim to reply within 24 hours.</p>
          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-3">
              <EnvelopeSimple size={20} className="mt-0.5 shrink-0 text-accent-2" />
              <span>
                <span className="block text-canvas/50">Email</span>info@pangeaconnects.com
              </span>
            </li>
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-accent-2" />
              <span>
                <span className="block text-canvas/50">Location</span>Brisbane, Queensland, Australia
              </span>
            </li>
          </ul>
        </div>
        <p className="px-2 text-sm text-ink-soft">Partnership, ambassador and professional listing enquiries go to the same inbox. Pick the topic and we route it.</p>
      </aside>

      <div className="rounded-[2rem] bg-card p-6 ring-1 ring-ink/5 md:p-10 lg:col-span-8">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
              <CheckCircle size={64} weight="duotone" className="text-accent" />
              <h2 className="mt-5 font-display text-3xl font-semibold">Message sent.</h2>
              <p className="mt-2 max-w-sm text-ink-soft">Thank you. We will get back to you within 24 hours. This is a demo, so nothing was actually sent.</p>
              <button type="button" onClick={() => { setSent(false); setErrors({}); }} className="mt-6 rounded-full bg-ink/[0.06] px-6 py-2.5 text-sm font-medium hover:bg-ink/10">
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" ref={form} name="contact" method="post" data-netlify="true" netlify-honeypot="company" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input type="hidden" name="form-name" value="contact" />
              <p className="absolute -left-[9999px]" aria-hidden>
                <label>
                  Company <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <Field label="Name" error={errors.name}>
                <input name="name" autoComplete="name" maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} className={FIELD} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input name="email" type="email" autoComplete="email" maxLength={120} aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} className={FIELD} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Topic" error={errors.topic}>
                  <select name="topic" defaultValue="" aria-invalid={!!errors.topic} aria-describedby={errors.topic ? "err-topic" : undefined} className={FIELD}>
                    <option value="" disabled>Select a topic</option>
                    {CONTACT_TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Message" error={errors.message}>
                  <textarea name="message" rows={6} maxLength={2000} aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined} className={`${FIELD} resize-y`} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="rounded-full bg-deep px-8 py-3.5 text-sm font-semibold text-canvas transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03] active:scale-[0.98]">
                  Send message
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = label.toLowerCase();
  return (
    <div>
      <label className="text-sm font-medium">
        {label} <span className="text-accent">*</span>
        {children}
      </label>
      {error && (
        <p id={`err-${id}`} role="alert" className="mt-1.5 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
