import type { Metadata } from "next";
import { Pricing, type Plan } from "@/components/sections/Pricing";
import { Eyebrow, SplitWords } from "@/components/motion";

export const metadata: Metadata = { title: "Membership", description: "Pangea membership tiers for community groups, skill providers, professionals and partners." };

// Prices from the brief. Points are placeholders until the client sends the real inclusions.
const PLANS: Plan[] = [
  { name: "Community", for: "NGOs and community groups", monthly: null, points: ["Community profile", "Post free events", "Share settlement guides"] },
  { name: "Skill Provider", for: "Migrants sharing their talents", monthly: 15, yearly: 149, points: ["Skill Exchange listing", "Bookings from members", "Profile in 13 languages"] },
  { name: "Professional", for: "Verified professionals", monthly: 39, yearly: 390, featured: true, points: ["Verified badge", "Services Directory listing", "Leads in your languages", "Priority placement"] },
  { name: "Partner", for: "Businesses and institutions", monthly: 199, points: ["Job and housing posts", "Sponsored events", "Partner page"] },
  { name: "Strategic", for: "Strategic partners", monthly: 499, points: ["Co-branded guides", "Impact reporting", "Dedicated contact"] },
];

export default function MembershipPage() {
  return (
    <section className="px-4 pb-16 pt-32 md:px-10 md:pt-40" aria-labelledby="membership-title">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow tone="accent">Membership</Eyebrow>
        <h1 id="membership-title" className="mt-6 font-display text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
          <SplitWords text="Free for newcomers. Fair for everyone else." play accents={{ "newcomers.": "font-serif font-normal italic text-accent" }} />
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">Migrants, refugees and students never pay. Members who offer services keep the platform free for them.</p>
      </div>
      <Pricing plans={PLANS} />
    </section>
  );
}
