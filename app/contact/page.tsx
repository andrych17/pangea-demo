import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { Eyebrow, SplitWords } from "@/components/motion";

export const metadata: Metadata = { title: "Contact", description: "Questions, partnerships, ambassador applications and professional listings." };

export default function ContactPage() {
  return (
    <>
      <section className="px-4 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40" aria-labelledby="contact-title">
        <div className="mx-auto max-w-[1400px]">
          <Eyebrow tone="accent">Contact us</Eyebrow>
          <h1 id="contact-title" className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.2rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-balance">
            <SplitWords text="Get in touch." play accents={{ "touch.": "font-serif font-normal italic text-accent" }} />
          </h1>
        </div>
      </section>
      <ContactForm />
    </>
  );
}
