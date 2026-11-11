import type { Preset } from "../lib/content.ts";

// Pangea pitch demo. Copy comes from the client's brief; feature blurbs are placeholders until their text arrives.
const PLAY = "https://play.google.com/store/apps/details?id=com.base6947d0e0f26b366ab4b8c6c1.app";

export const education: Preset = {
  sector: "education",
  fits: "Schools, tutoring, online courses, coaching, nurseries, music lessons, community groups",
  theme: "pangea",
  fonts: "classic",
  brand: {
    name: "pangea",
    accent: "",
    tagline: "A free platform for migrants, refugees and international students settling in Australia.",
    description: "Find your people. Guides, housing, jobs, services and events for migrants settling in Australia, in 13 languages.",
  },
  nav: [
    { label: "Settle in AU", href: "/#process" },
    { label: "Features", href: "/#work" },
    { label: "Membership", href: "/membership" },
  ],
  cta: { label: "Get the app", href: PLAY },
  home: {
    hero: {
      eyebrow: "Free for migrants, refugees and international students",
      title: "Find your people.",
      accentWords: ["people."],
      body: "The human connections that make Australia feel like home.",
      primary: { label: "Get it on Google Play", href: PLAY },
      secondary: { label: "Watch the 60-second tour", href: "/#video" },
      badge: "FOR MIGRANTS • BY MIGRANTS • ",
      badgeCenter: "AU",
      visuals: [
        { icon: "Users", alt: "Pangea app: Community and events screen", photo: "/photos/app-4.jpg" },
        { icon: "Briefcase", alt: "Pangea app: Jobs and opportunities screen", photo: "/photos/app-1.jpg" },
        { icon: "Stethoscope", alt: "Pangea app: Services directory screen", photo: "/photos/app-3.jpg" },
      ],
      stats: [{ value: 13, label: "languages" }, { value: 10, label: "settlement guides" }, { value: 5, label: "cities" }],
    },
    marquee: [
      ["Housing", "Jobs", "Events", "Services", "Skill Exchange", "Guides"],
      ["English", "中文", "العربية", "Tiếng Việt", "हिन्दी", "Español", "Filipino", "한국어", "فارسی", "Português"],
    ],
    statement: {
      text: "Moving to a new country is lonely in a way nobody warns you about. Pangea is built by migrants who have been there, so the next family starts with people, not paperwork.",
      accentWords: ["people,"],
    },
    features: {
      eyebrow: "Why Pangea",
      title: "Built for your first year in Australia.",
      items: [
        { title: "Free for newcomers", body: "Migrants, refugees and students use every core feature at no cost.", icon: "Heart" },
        { title: "Your language", body: "Thirteen languages, including right-to-left Arabic, Farsi and Dari.", icon: "Globe", stat: { value: 13, label: "languages" } },
        { title: "Verified professionals", body: "Doctors, lawyers and trades with checked credentials.", icon: "ShieldCheck" },
        { title: "Real community", body: "Events, skill swaps and people who made the same move.", icon: "Users", stat: { value: 5, suffix: "+", label: "yrs settlement experience" } },
      ],
    },
    showcase: {
      eyebrow: "Inside the app",
      title: "Seven ways to settle in",
      body: "Everything a newcomer asks in the first months, in one free app.",
      cards: [
        { title: "AI Settlement Assistant", body: "Ask anything about visas, Medicare or schools, in your language.", tag: "Ask anytime", visual: { icon: "Robot", alt: "People using the Pangea app together", photo: "/photos/ai.jpg" } },
        { title: "Practical Support Guides", body: "Ten categories of step-by-step guides for five cities.", tag: "10 categories", visual: { icon: "BookOpen", alt: "A newcomer getting help with paperwork", photo: "/photos/guides.jpg" } },
        { title: "Housing Listings", body: "Rooms and rentals from people who welcome newcomers.", tag: "Find a home", visual: { icon: "House", alt: "A row of Australian houses", photo: "/photos/housing.jpg" } },
        { title: "Jobs Board", body: "Local and professional jobs, filtered by language.", tag: "Find work", visual: { icon: "Briefcase", alt: "Migrant worker on a construction site", photo: "/photos/jobs.jpg" } },
        { title: "Services Directory", body: "Doctors, migration agents and trades who speak your language.", tag: "Verified", visual: { icon: "Stethoscope", alt: "Doctor talking with a patient", photo: "/photos/services.jpg" } },
        { title: "Skill Exchange", body: "Teach what you know, learn what you need.", tag: "Community", visual: { icon: "Handshake", alt: "Couple Latin dancing", photo: "/photos/skills.jpg" } },
        { title: "Events", body: "Cultural festivals and meetups near you.", tag: "This month", visual: { icon: "Confetti", alt: "Women celebrating at a Holi festival", photo: "/photos/events.jpg" } },
      ],
    },
    steps: {
      eyebrow: "Settle in AU",
      title: "Ten guides. Five cities. One place to start.",
      items: [
        { title: "Land and get set up", body: "Tax file number, Medicare, bank account and phone, in the right order.", icon: "AirplaneTilt" },
        { title: "Find a home", body: "How renting works, what a bond is, and listings from friendly hosts.", icon: "House" },
        { title: "Find work", body: "Resumes the Australian way, your rights at work, and jobs that value your languages.", icon: "Briefcase" },
        { title: "Find your people", body: "Events, community groups and people from home, near you.", icon: "Users" },
      ],
    },
    cta: {
      eyebrow: "Free on Android",
      title: "Find your people",
      accent: "in 13 languages.",
      body: "Download Pangea and meet the people who make Australia feel like home.",
      button: { label: "Get it on Google Play", href: PLAY },
      visual: { icon: "Globe", alt: "Aerial view of Australian suburbs", photo: "/photos/suburbs.jpg" },
    },
  },
  // /dashboard is removed in this demo; the type still needs the block.
  app: {
    title: "Events",
    intro: "Upcoming community events.",
    singular: "Event",
    plural: "Events",
    statuses: ["Draft", "Published", "Done"],
    metaLabel: "City",
    placeholder: { title: "Event name", meta: "City" },
    seed: [
      { title: "Cultural festival", meta: "Brisbane", status: 1 },
      { title: "Skill swap evening", meta: "Brisbane", status: 1 },
      { title: "Renting 101 workshop", meta: "Brisbane", status: 0 },
      { title: "Newcomer picnic", meta: "Brisbane", status: 2 },
    ],
  },
  photoQueries: [],
};
