import type { IconName } from "../components/Icon.ts";

/**
 * Pangea-specific content for the extra pages (/settle, /services, /contact) and the home page extras.
 * Guide facts and feature names are taken from pangeaconnects.com; verify every number and phone line with the
 * client before launch. Service providers are made up.
 */

export type Guide = {
  id: string;
  title: string;
  tagline: string;
  icon: IconName;
  intro: string;
  facts: { label: string; value: string }[];
  /** Highlighted note under the facts. */
  tip: { label: string; text: string };
  list: { title: string; items: { name: string; note: string }[] };
  action: { label: string; href: string };
};

export const GUIDES: Guide[] = [
  {
    id: "tfn",
    title: "TFN & Tax File Number",
    tagline: "Free · ~28 days · ATO",
    icon: "FileText",
    intro: "Without a Tax File Number your employer must withhold 47% of your income in tax. It is completely free to apply.",
    facts: [
      { label: "Processing", value: "~28 days" },
      { label: "Cost", value: "Free" },
      { label: "Issued by", value: "ATO" },
      { label: "Valid for", value: "Lifetime" },
    ],
    tip: { label: "Without a TFN", text: "Employers withhold 47% tax. Banks also withhold tax on interest." },
    list: {
      title: "You will need it to",
      items: [
        { name: "Start any job legally", note: "Employers ask for it on day one." },
        { name: "Lodge your tax return", note: "And claim refunds." },
        { name: "Open a bank account", note: "Without extra tax on interest." },
        { name: "Access super and Centrelink", note: "Both link to your TFN." },
      ],
    },
    action: { label: "Apply on myGov", href: "https://my.gov.au/" },
  },
  {
    id: "banking",
    title: "Banking",
    tagline: "Passport only · Same day · Free",
    icon: "Bank",
    intro: "Australia's major banks let you apply before you arrive using just your passport. No local ID needed within 6 weeks of arrival.",
    facts: [
      { label: "Documents", value: "Passport only" },
      { label: "Pre-arrival", value: "Yes, online" },
      { label: "Cost", value: "Free" },
      { label: "Time", value: "Same day" },
    ],
    tip: { label: "New arrival tip", text: "Apply within 6 weeks. Your passport is enough." },
    list: {
      title: "Major banks and neobanks",
      items: [
        { name: "Commonwealth Bank", note: "Largest ATM network, pre-arrival." },
        { name: "ANZ, NAB, Westpac", note: "Passport-only applications." },
        { name: "Wise", note: "Multi-currency, good for overseas transfers." },
        { name: "ING", note: "No monthly fees, 100% online." },
      ],
    },
    action: { label: "CommBank pre-arrival", href: "https://www.commbank.com.au/moving-to-australia.html" },
  },
  {
    id: "medicare",
    title: "Medicare & Health",
    tagline: "PR & citizens · Free · Services Australia",
    icon: "Heartbeat",
    intro: "Medicare is Australia's public healthcare system. Eligibility depends on your visa. Free services are available for all migrants.",
    facts: [
      { label: "Eligible", value: "PR & citizens" },
      { label: "Issued by", value: "Services Australia" },
      { label: "Processing", value: "2–4 weeks" },
      { label: "Cost", value: "Free" },
    ],
    tip: { label: "Not eligible?", text: "Community health centres offer bulk billing regardless of visa." },
    list: {
      title: "Free services for all migrants",
      items: [
        { name: "Healthdirect", note: "Free 24/7 health advice (1800 022 222)." },
        { name: "Community health centres", note: "Bulk billing regardless of visa." },
        { name: "13 HEALTH", note: "Free nurse advice (13 43 25 84)." },
      ],
    },
    action: { label: "Enrol in Medicare", href: "https://www.servicesaustralia.gov.au/medicare" },
  },
  {
    id: "licences",
    title: "Licences & Certifications",
    tagline: "From $50 · 1 day – 2 weeks · TAFE",
    icon: "Medal",
    intro: "Many jobs require specific licences. Most are short courses completable in a day, often for under $150.",
    facts: [
      { label: "Most common", value: "RSA / White Card" },
      { label: "Duration", value: "1 day – 2 weeks" },
      { label: "Cost", value: "$50 – $500" },
      { label: "Provider", value: "TAFE & RTOs" },
    ],
    tip: { label: "In the app", text: "Step-by-step guides to every certification you need to work in Australia, in your language." },
    list: {
      title: "By industry",
      items: [
        { name: "Hospitality", note: "RSA ~$50, 1 day." },
        { name: "Construction", note: "White Card ~$100, 1 day." },
        { name: "Childcare", note: "WWC Check, free, online." },
        { name: "Driving", note: "Convert an overseas licence via TMR QLD." },
      ],
    },
    action: { label: "Browse TAFE courses", href: "https://tafeqld.edu.au/" },
  },
  {
    id: "gov",
    title: "Government Services",
    tagline: "myGov · Free · TIS: 131 450",
    icon: "Buildings",
    intro: "myGov connects you to Medicare, the ATO, Centrelink and more in one account. Everything is accessible online, free.",
    facts: [
      { label: "Platform", value: "myGov" },
      { label: "Access", value: "Online & in person" },
      { label: "Interpreter", value: "TIS: 131 450" },
      { label: "Cost", value: "Free" },
    ],
    tip: { label: "TIS National (131 450)", text: "Free interpreter, 24/7, for any government call." },
    list: {
      title: "Essential platforms",
      items: [
        { name: "myGov", note: "Medicare, ATO and Centrelink in one login." },
        { name: "Fair Work Ombudsman", note: "Check your pay rights." },
        { name: "VEVO", note: "Verify your visa entitlements, free." },
      ],
    },
    action: { label: "Go to myGov", href: "https://my.gov.au/" },
  },
  {
    id: "lgbtqia",
    title: "LGBTQIA+ Resources",
    tagline: "QLife: 1800 184 527 · Free · Brisbane",
    icon: "Heart",
    intro: "Australia has strong legal protections for LGBTQIA+ people. Queensland law prohibits discrimination based on sexual orientation and gender identity.",
    facts: [
      { label: "Crisis line", value: "1800 184 527" },
      { label: "Hours", value: "3pm – midnight" },
      { label: "Chat", value: "qlife.org.au" },
      { label: "Cost", value: "Free" },
    ],
    tip: { label: "Your rights", text: "Queensland's Anti-Discrimination Act protects you in employment, housing and services." },
    list: {
      title: "Key organisations",
      items: [
        { name: "QLife", note: "Peer support and crisis line." },
        { name: "Open Doors Youth Service", note: "LGBTQIA+ youth under 26." },
        { name: "QLD Council for LGBTI Health", note: "Health and advocacy." },
        { name: "Brisbane Pride", note: "Community events." },
      ],
    },
    action: { label: "Contact QLife", href: "https://qlife.org.au/" },
  },
  {
    id: "ndis",
    title: "Disability Support",
    tagline: "NDIS · PR & citizens · Free to apply",
    icon: "ShieldCheck",
    intro: "The NDIS funds support for people with permanent and significant disability. Permanent residents and citizens can apply.",
    facts: [
      { label: "Scheme", value: "NDIS" },
      { label: "Eligible", value: "PR & citizens" },
      { label: "Age limit", value: "Under 65" },
      { label: "Cost", value: "Free to apply" },
    ],
    tip: { label: "Temporary visa holders", text: "Generally not eligible for the NDIS, but may access state-funded services." },
    list: {
      title: "How to apply",
      items: [
        { name: "Call 1800 800 110", note: "Or visit ndis.gov.au." },
        { name: "Submit an Access Request", note: "With evidence of disability." },
        { name: "Build your plan", note: "An NDIS planner develops it with you." },
        { name: "Carer Gateway", note: "1800 422 737." },
      ],
    },
    action: { label: "Apply for NDIS", href: "https://www.ndis.gov.au/" },
  },
];

/** The first-weeks checklist, built from the guides above. `guide` links an item back to its card. */
export const CHECKLIST: { id: string; label: string; when: string; guide: string }[] = [
  { id: "bank", label: "Open a bank account", when: "Within 6 weeks", guide: "banking" },
  { id: "tfn", label: "Apply for your Tax File Number", when: "Before your first job", guide: "tfn" },
  { id: "mygov", label: "Create a myGov account", when: "Week 1", guide: "gov" },
  { id: "medicare", label: "Enrol in Medicare if you are eligible", when: "Weeks 1 to 4", guide: "medicare" },
  { id: "licence", label: "Book the licence your industry needs", when: "Before you apply for work", guide: "licences" },
  { id: "tis", label: "Save the free interpreter line: 131 450", when: "Today", guide: "gov" },
];

export type FeatureGroup = { id: string; label: string; icon: IconName; photo: string; alt: string; items: { title: string; body: string; icon: IconName }[] };

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "settle",
    label: "Settle",
    icon: "AirplaneTilt",
    photo: "/photos/guides.jpg",
    alt: "A newcomer getting help with paperwork",
    items: [
      { title: "Settlement guides", body: "Step-by-step guides for the first moments, in 13 languages.", icon: "BookOpen" },
      { title: "AI settlement assistant", body: "Instant answers to your settlement questions, in your language.", icon: "Robot" },
      { title: "Government services", body: "myGov, Medicare, ATO and Centrelink links in one place.", icon: "Buildings" },
      { title: "Licences and certifications", body: "What your industry requires and where to get it.", icon: "Medal" },
    ],
  },
  {
    id: "work",
    label: "Work",
    icon: "Briefcase",
    photo: "/photos/jobs.jpg",
    alt: "Migrant worker on a construction site",
    items: [
      { title: "Job listings", body: "Community-driven alerts with salary, duration and employer details.", icon: "Briefcase" },
      { title: "Skill exchange", body: "Offer teaching, IT, trades or arts and get community help back.", icon: "Handshake" },
      { title: "Monetise your skills", body: "Set your rates and start earning within your community.", icon: "Wallet" },
      { title: "Volunteering", body: "Build local experience and grow your network.", icon: "Student" },
    ],
  },
  {
    id: "home",
    label: "Home",
    icon: "House",
    photo: "/photos/housing.jpg",
    alt: "A row of Australian houses",
    items: [
      { title: "Rooms and shared housing", body: "Safe listings from community members you can trust.", icon: "Key" },
      { title: "Apartments and units", body: "Rentals with culturally aware landlords and agents.", icon: "Buildings" },
      { title: "Verified listings", body: "Community-checked to protect new arrivals from scams.", icon: "ShieldCheck" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: "Stethoscope",
    photo: "/photos/services.jpg",
    alt: "Doctor talking with a patient",
    items: [
      { title: "Verified professionals", body: "Doctors, lawyers, accountants and trades who speak your language.", icon: "Stethoscope" },
      { title: "Multilingual profiles", body: "Every provider lists the languages they work in.", icon: "Globe" },
      { title: "Book and pay in the app", body: "Secure payments through Stripe, no cash handovers.", icon: "CreditCard" },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: "Users",
    photo: "/photos/events.jpg",
    alt: "Women celebrating at a Holi festival",
    items: [
      { title: "Find people", body: "Connect with people from your culture living near you.", icon: "Users" },
      { title: "Migration forum", body: "Peer advice on visas, housing, jobs and life in Australia.", icon: "ChatCircleDots" },
      { title: "Events and culture", body: "Cultural celebrations and gatherings near you.", icon: "CalendarCheck" },
    ],
  },
];

export const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 8, suffix: "M+", label: "Migrants in Australia" },
  { value: 13, suffix: "+", label: "Languages supported" },
  { value: 23, suffix: "", label: "App features" },
  { value: 100, suffix: "%", label: "Community-driven" },
];

export type ServiceCategory = "Doctors" | "Lawyers" | "Migration agents" | "Accountants" | "Trades" | "Translators";
export const SERVICE_CATEGORIES: ServiceCategory[] = ["Doctors", "Lawyers", "Migration agents", "Accountants", "Trades", "Translators"];

export type Provider = { name: string; category: ServiceCategory; role: string; city: string; langs: string[]; years: number; blurb: string; icon: IconName; verified: boolean };

// Made-up people and practices for the demo. `langs` are codes from lib/i18n.ts.
export const PROVIDERS: Provider[] = [
  { name: "Dr Mai Tran", category: "Doctors", role: "General practitioner", city: "Brisbane", langs: ["vi", "en"], years: 11, blurb: "Bulk billing for new arrivals. Health checks, vaccinations and referrals.", icon: "Stethoscope", verified: true },
  { name: "Dr Hamid Rahimi", category: "Doctors", role: "General practitioner", city: "Logan", langs: ["prs", "fa", "en"], years: 8, blurb: "Family medicine with a focus on refugee health assessments.", icon: "Heartbeat", verified: true },
  { name: "Dr Sofia Mendes", category: "Doctors", role: "Women's health", city: "Gold Coast", langs: ["pt", "es", "en"], years: 14, blurb: "Antenatal care, screening and contraception, in Portuguese or Spanish.", icon: "FirstAid", verified: true },
  { name: "Lucía Herrera", category: "Lawyers", role: "Employment and family law", city: "Brisbane", langs: ["es", "en"], years: 9, blurb: "Unpaid wages, unfair dismissal and family matters. First call is free.", icon: "Scales", verified: true },
  { name: "Wei Zhang", category: "Lawyers", role: "Property and business law", city: "Sunnybank", langs: ["zh", "en"], years: 12, blurb: "Lease reviews, small business set-up and contracts.", icon: "Scales", verified: true },
  { name: "Priya Nair", category: "Migration agents", role: "Registered migration agent", city: "Brisbane", langs: ["hi", "pa", "en"], years: 10, blurb: "Visa pathways, skills assessments and partner visas.", icon: "AirplaneTilt", verified: true },
  { name: "Jun-ho Park", category: "Migration agents", role: "Registered migration agent", city: "Ipswich", langs: ["ko", "en"], years: 6, blurb: "Student to graduate visas and employer sponsorship.", icon: "AirplaneTilt", verified: true },
  { name: "Ahmed Al-Sayed", category: "Accountants", role: "Tax and BAS", city: "Logan", langs: ["ar", "en"], years: 13, blurb: "Tax returns, ABN set-up and BAS for sole traders.", icon: "Receipt", verified: true },
  { name: "Maria Santos", category: "Accountants", role: "Tax agent", city: "Brisbane", langs: ["tl", "en"], years: 7, blurb: "Tax returns for new arrivals and seasonal workers.", icon: "Receipt", verified: false },
  { name: "Bikash Gurung", category: "Trades", role: "Electrician", city: "Brisbane", langs: ["ne", "hi", "en"], years: 9, blurb: "Licensed residential electrical work. Free quotes.", icon: "Hammer", verified: true },
  { name: "Tuan Le", category: "Trades", role: "Plumber", city: "Sunshine Coast", langs: ["vi", "en"], years: 15, blurb: "Hot water, blocked drains and bathroom fit-outs.", icon: "Hammer", verified: true },
  { name: "Layla Karimi", category: "Translators", role: "NAATI certified translator", city: "Online", langs: ["fa", "prs", "ar", "en"], years: 8, blurb: "Certified translation of documents for visas, study and work.", icon: "PenNib", verified: true },
];

export const CONTACT_TOPICS = ["General enquiry", "Partnership opportunity", "Ambassador application", "Professional listing", "Media & press", "Other"] as const;
