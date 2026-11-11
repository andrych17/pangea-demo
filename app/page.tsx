import { PRESET } from "@/presets";
import { Hero } from "@/components/sections/Hero";
import { Languages } from "@/components/sections/Languages";
import { Statement } from "@/components/sections/Statement";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { Video } from "@/components/sections/Video";
import { Steps } from "@/components/sections/Steps";
import { Founder } from "@/components/sections/Founder";
import { Cta } from "@/components/sections/Cta";

// Server component: reads the preset and hands each section only its slice (plain data, no functions).
export default function Home() {
  const { home } = PRESET;
  return (
    <>
      <Hero hero={home.hero} />
      <Languages />
      <Statement marquee={home.marquee} statement={home.statement} />
      <Showcase showcase={home.showcase} />
      <Video id="kIJu86Ag8-s" title="See Pangea in a minute." body="A quick tour of the app: guides, housing, jobs and the people you will meet. Tap to play, nothing loads until you do." />
      <Features features={home.features} />
      <Steps steps={home.steps} />
      <Founder
        name="Andres Gutierrez"
        title="Founder · Pangea Connects Pty Ltd"
        badge="5+ yrs Settlement experience"
        quote="A free digital platform for migrants, refugees and international students settling in Australia."
      />
      <Cta cta={home.cta} />
    </>
  );
}
