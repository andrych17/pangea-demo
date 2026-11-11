/**
 * The 13 languages from the brief. Demo scope: the hero headline and subheadline switch language and
 * direction; the real site would load one JSON file per language for every string.
 * Translations here are drafts for the pitch and need a native speaker's review before launch.
 */
export type Lang = { code: string; name: string; english: string; rtl?: boolean; title: string; body: string };

export const LANGS: Lang[] = [
  { code: "en", name: "English (AU)", english: "English", title: "Find your people.", body: "The human connections that make Australia feel like home." },
  { code: "zh", name: "中文", english: "Chinese", title: "找到属于你的人。", body: "让澳大利亚有家的感觉的人与人之间的联系。" },
  { code: "ar", name: "العربية", english: "Arabic", rtl: true, title: "اعثر على ناسك.", body: "الروابط الإنسانية التي تجعل أستراليا تشعر وكأنها وطنك." },
  { code: "vi", name: "Tiếng Việt", english: "Vietnamese", title: "Tìm thấy người của bạn.", body: "Những kết nối con người giúp nước Úc trở thành nhà." },
  { code: "hi", name: "हिन्दी", english: "Hindi", title: "अपने लोगों को खोजें।", body: "वे मानवीय रिश्ते जो ऑस्ट्रेलिया को घर जैसा बनाते हैं।" },
  { code: "pa", name: "ਪੰਜਾਬੀ", english: "Punjabi", title: "ਆਪਣੇ ਲੋਕਾਂ ਨੂੰ ਲੱਭੋ।", body: "ਉਹ ਮਨੁੱਖੀ ਰਿਸ਼ਤੇ ਜੋ ਆਸਟ੍ਰੇਲੀਆ ਨੂੰ ਘਰ ਵਰਗਾ ਬਣਾਉਂਦੇ ਹਨ।" },
  { code: "es", name: "Español", english: "Spanish", title: "Encuentra a tu gente.", body: "Las conexiones humanas que hacen que Australia se sienta como en casa." },
  { code: "tl", name: "Filipino", english: "Filipino", title: "Hanapin ang iyong mga kasama.", body: "Ang mga ugnayang nagpaparamdam na tahanan ang Australia." },
  { code: "ne", name: "नेपाली", english: "Nepali", title: "आफ्ना मान्छेहरू भेट्टाउनुहोस्।", body: "ती मानवीय सम्बन्धहरू जसले अष्ट्रेलियालाई घरजस्तै बनाउँछन्।" },
  { code: "ko", name: "한국어", english: "Korean", title: "나의 사람들을 만나세요.", body: "호주를 집처럼 느끼게 해 주는 사람과 사람 사이의 연결." },
  { code: "fa", name: "فارسی", english: "Farsi", rtl: true, title: "آدم‌های خودت را پیدا کن.", body: "پیوندهای انسانی که استرالیا را برایت مثل خانه می‌کند." },
  { code: "prs", name: "دری", english: "Dari", rtl: true, title: "مردم خود را پیدا کنید.", body: "پیوندهای انسانی که استرالیا را برای شما مانند خانه می‌سازد." },
  { code: "pt", name: "Português", english: "Portuguese", title: "Encontre a sua gente.", body: "As conexões humanas que fazem a Austrália parecer um lar." },
];

export const DEFAULT_LANG = "en";
export const findLang = (code: string): Lang => LANGS.find((l) => l.code === code) ?? LANGS[0];

export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.base6947d0e0f26b366ab4b8c6c1.app";
