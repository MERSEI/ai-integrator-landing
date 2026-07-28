import type { Content } from "./types";

export const en: Content = {
  htmlLang: "en",

  meta: {
    title: "AI Integrator — Your AI marketplace for sales and lead generation",
    description:
      "15 ready-made AI apps that automate sales, marketing, and operations. Live in 72 hours, no developers needed.",
    ogAlt: "AI Integrator — AI marketplace for sales",
  },

  statusLabels: {
    live: "Live",
    demo: "Demo",
    soon: "Soon",
  },

  categories: [
    { key: "all", label: "All" },
    { key: "attract", label: "Lead gen" },
    { key: "sales", label: "Sales" },
    { key: "content", label: "Content" },
    { key: "analytics", label: "Analytics" },
  ],

  featuredApps: [
    {
      id: "poaching",
      name: "Poaching",
      tagline: "Lead hunting",
      category: "attract",
      image: "/images/apps/poaching.jpg",
      href: "/apps/poaching",
      status: "demo",
      description:
        "Monitors your competitors and finds people already shopping for what you sell",
      result: "+30 leads in a week",
    },
    {
      id: "salesagent",
      name: "SalesAgent",
      tagline: "AI closer",
      category: "sales",
      image: "/images/apps/salesagent.jpg",
      status: "soon",
      description:
        "Qualifies leads, handles objections, and books meetings around the clock",
      result: "Conversion +25%",
    },
    {
      id: "bizdoctor",
      name: "BizDoctor",
      tagline: "Analytics",
      category: "analytics",
      image: "/images/apps/bizdoctor.jpg",
      href: "/apps/bizdoctor",
      status: "live",
      description:
        "Shows you exactly where you're losing money and what to fix to grow",
      result: "Profit +40%",
    },
    {
      id: "coldmessage",
      name: "ColdMessage Pro",
      tagline: "Outreach",
      category: "sales",
      image: "/images/apps/coldmessage.jpg",
      href: "/apps/coldmessage",
      status: "live",
      description:
        "Personalizes every email with AI — 3–5x higher open rates",
      result: "Open rate +300%",
    },
    {
      id: "contentloop",
      name: "ContentLoop",
      tagline: "Content",
      category: "content",
      image: "/images/apps/contentloop.jpg",
      status: "soon",
      description: "Creates and publishes social content automatically",
      result: "Saves 20+ hours/month",
    },
    {
      id: "objectionkiller",
      name: "ObjectionKiller",
      tagline: "Objections",
      category: "sales",
      image: "/images/apps/objectionkiller.jpg",
      href: "/apps/objectionkiller",
      status: "live",
      description:
        "Tells you how to answer a customer's objection in real time",
      result: "Deals closed +20%",
    },
  ],

  standaloneApps: [
    {
      id: "personachannel",
      name: "PersonaChannel",
      tagline: "Content in your voice",
      category: "content",
      image: "/images/apps/personachannel.jpg",
      href: "/apps/personachannel",
      status: "live",
      description:
        "Writes content in your own tone and style — tailored to a specific persona and audience",
      result: "Content in 5 minutes",
    },
    {
      id: "followupbot",
      name: "FollowUpBot",
      tagline: "Deal follow-ups",
      category: "sales",
      image: "/images/apps/followupbot.jpg",
      href: "/apps/followupbot",
      status: "live",
      description:
        "Builds follow-up sequences that revive stalled deals without the pressure",
      result: "+35% reply rate",
    },
    {
      id: "inboxzero",
      name: "InboxZero",
      tagline: "Inbox triage",
      category: "sales",
      image: "/images/apps/inboxzero.jpg",
      href: "/apps/inboxzero",
      status: "live",
      description:
        "Sorts incoming email, pulls out the action items, and drafts a reply in the right tone",
      result: "−80% time on email",
    },
    {
      id: "leadradar",
      name: "LeadRadar",
      tagline: "Hot-intent radar",
      category: "attract",
      image: "/images/apps/leadradar.jpg",
      href: "/apps/leadradar",
      status: "demo",
      description:
        "Spots high-intent requests in real time and tells you who to message first",
      result: "Leads in real time",
    },
    {
      id: "commenthunter",
      name: "Comment Hunter",
      tagline: "Leads in comments",
      category: "attract",
      image: "/images/apps/commenthunter.jpg",
      href: "/apps/commenthunter",
      status: "demo",
      description:
        "Finds potential customers hiding in the comments under competitors' posts",
      result: "Leads from comments",
    },
    {
      id: "trendsniper",
      name: "Trend Sniper",
      tagline: "Trend analytics",
      category: "analytics",
      image: "/images/apps/trendsniper.jpg",
      href: "/apps/trendsniper",
      status: "demo",
      description:
        "Shows which topics are taking off while your competitors haven't noticed yet",
      result: "Two steps ahead of trends",
    },
  ],

  soonApps: [
    { id: "competitorwatch", name: "CompetitorWatch", tagline: "Competitor monitoring" },
    { id: "reelfactory", name: "ReelFactory", tagline: "Automated Reels editing" },
    { id: "meetingscribe", name: "MeetingScribe", tagline: "Meeting notes" },
  ],

  nav: {
    apps: "Apps",
    howItWorks: "How it works",
    pricing: "Pricing",
    faq: "FAQ",
    results: "Results",
    moreTools: "More tools",
    seeAllApps: "See all 15 apps",
    soonBadge: "Soon",
    telegram: "Message us on Telegram",
    cta: "Get an audit",
    mainNavLabel: "Main navigation",
    mobileNavLabel: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLanguage: "Перейти на русский",
    allApps: "All apps",
    back: "Back",
  },

  hero: {
    badge: "Live in 72 hours, no developers",
    headingLead: "Your AI marketplace for ",
    headingAccent: "sales and lead generation",
    subtitle:
      "15 ready-made apps that automate sales, marketing, and operations. Up and running in 72 hours, no developers needed.",
    cta: "Get an audit (free)",
    trust: [
      "No credit card required",
      "Free analysis tailored to you (call after email feedback)",
    ],
  },

  problems: {
    titleLead: "You're losing customers ",
    titleAccent: "without automation",
    items: [
      "No inbound leads — customers go to competitors instead",
      "Sales depend entirely on you — there's no way to scale",
      "Content needs an editor and a social media manager",
      "You don't know where the money leaks out of your business",
      "Cold outreach just doesn't land",
    ],
    boxTitle: "Most businesses need tools, but:",
    boxItems: [
      "— Zapier/Make are too complex (you need a developer)",
      "— HubSpot is expensive (from $45/month per seat)",
      "— Homegrown fixes don't scale",
    ],
    imageAlt: "A business owner buried in chaotic manual processes",
  },

  features: {
    title: "15 ready-made AI tools for your business",
    subtitle:
      "Pick the apps you need and start working within 72 hours — each bot takes over its slice of the busywork: leads, analytics, inbox, and content.",
    imageAlt:
      "A team of AI bots handling leads, analytics, email, and content",
    categoriesLabel: "App categories",
    open: "Open",
    soonTitle: "Coming soon",
  },

  howItWorks: {
    title: "How it works",
    subtitle: "Three steps from chaos to a working system",
    steps: [
      {
        number: "01",
        time: "1 hour",
        title: "Diagnosis",
        image: "/images/steps/step-1.jpg",
        imageAlt:
          "A client fills out a questionnaire, AI processes the data and produces a business report",
        points: [
          "You answer questions about your business",
          "Our AI analyzes where you're losing customers",
          "You get a detailed report",
        ],
      },
      {
        number: "02",
        time: "2–3 hours",
        title: "Setup",
        image: "/images/steps/step-2.jpg",
        imageAlt:
          "Scattered services and data connect into a single workflow",
        points: [
          "We pick the right apps from the catalog",
          "We connect them to your systems (CRM, email, and more)",
          "We tune everything to your niche",
        ],
      },
      {
        number: "03",
        time: "48–72 hours",
        title: "Launch",
        image: "/images/steps/step-3.jpg",
        imageAlt: "Apps go live and business metrics start climbing",
        points: [
          "A 30-minute training session",
          "Your apps go live in production",
          "24/7 support for the first week",
        ],
      },
    ],
    outroLead: "In 72 hours you have a working tool — ",
    outroAccent: "no developers, no chaos.",
  },

  results: {
    title: "Real results from our clients",
    rating: "4.8/5 average rating",
    ratingAria: "Rated 4.8 out of 5",
    advantages: [
      {
        title: "Works out of the box",
        description:
          "No waiting weeks for development from scratch — the tool is already built and goes live 48–72 hours after setup.",
      },
      {
        title: "Tailored to your niche",
        description:
          "Not a generic template — the logic, tone, and scenarios adapt to your business, industry, and processes.",
      },
    ],
    testimonials: [
      {
        name: "Ivan P.",
        company: "E-commerce store",
        image: "/images/testimonials/ivan.png",
        task: "No inbound leads",
        solution: "Poaching",
        result: "+45 leads in a month, conversion +30%",
        quote:
          "Poaching changed our business. Leads used to come only from ads; now the system finds hot prospects on its own.",
      },
      {
        name: "Anna K.",
        company: "SaaS startup",
        image: "/images/testimonials/anna-en.svg",
        task: "Sales were slipping",
        solution: "SalesAgent + ColdMessage Pro",
        result: "MRR +200%, deals on autopilot",
        quote:
          "The AI closer books meetings while the team sleeps. We doubled MRR in a quarter without hiring a single rep.",
      },
      {
        name: "Oleg S.",
        company: "Consultant",
        image: "/images/testimonials/oleg-en.svg",
        task: "No time for marketing",
        solution: "ContentLoop + LeadRadar",
        result: "−20 hours/month, steady lead flow",
        quote:
          "Content publishes itself and leads come in steadily. I finally spend my time on clients instead of social media.",
      },
      {
        name: "Marina V.",
        company: "Online school",
        image: "/images/testimonials/marina-en.svg",
        task: "Objections were stalling sales",
        solution: "ObjectionKiller",
        result: "Close rate +35%, ready in 3 days",
        quote:
          "I worried we'd get a one-size-fits-all template. Instead the bot knew the objections specific to our courses from day one — it was built around our niche, not handed to us off the shelf.",
      },
      {
        name: "Dmitry K.",
        company: "Real estate agency",
        image: "/images/testimonials/dmitry-en.svg",
        task: "Drowning in incoming email",
        solution: "InboxZero",
        result: "15 hours/week saved from day one",
        quote:
          "I expected weeks of explaining how real estate works. Instead we plugged the tool in and it fit our processes immediately, right out of the box.",
      },
    ],
    stats: [
      { value: "50+", label: "clients on the platform" },
      { value: "+500", label: "leads per month (total)" },
      { value: "85%", label: "retention rate" },
      { value: "+40%", label: "average revenue increase" },
    ],
    portraitAlt: (name) => `Portrait: ${name}`,
  },

  pricing: {
    title: "Simple pricing, no hidden fees",
    subtitle:
      "The tool demos and the consultation are free. You only pay for the build around your niche and for support.",
    imageAlt:
      "Three plans: from a single tool to every app on the platform",
    tiers: [
      {
        name: "Starter",
        setup: 155,
        price: 30,
        popular: false,
        audience: "Freelancers, small business",
        features: [
          "1 app built around your niche",
          "Diagnosis + build around your processes",
          "Integration with your systems",
          "Support and updates",
        ],
        cta: "Get started",
      },
      {
        name: "Growth",
        setup: 370,
        price: 100,
        popular: true,
        audience: "E-commerce, small agencies",
        features: [
          "3 apps of your choice",
          "Diagnosis + build around your processes",
          "Integration with your systems",
          "Priority support",
        ],
        cta: "Most popular",
      },
      {
        name: "Enterprise",
        setup: 1175,
        price: 500,
        popular: false,
        audience: "Larger businesses and teams",
        features: [
          "Every app on the platform",
          "Custom app for your specific needs",
          "Integration with your systems",
          "Dedicated manager",
        ],
        cta: "Talk to us",
      },
    ],
    setupSuffix: " to build",
    thenPrefix: "then",
    perMonth: "/month",
    supportSuffix: "— support and updates",
    popularBadge: "Popular",
    footnote:
      "It starts with a free tool demo and a consultation. The build is a one-time fee; the subscription covers support and updates only.",
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Do I need a developer to set this up?",
        answer: "No. It's all no-code. We set everything up for you within 72 hours.",
      },
      {
        question: "How long does it take?",
        answer:
          "From 1 hour for the diagnosis to 72 hours to go live. After that the tool runs itself — you just watch the results.",
      },
      {
        question: "Does it work with my CRM?",
        answer:
          "Yes. We integrate with HubSpot, Salesforce, Pipedrive, and anything else via Zapier or webhooks.",
      },
      {
        question: "What if the app doesn't work out?",
        answer:
          "Our guarantee: no results after a week and we refund you. No questions asked.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Free means a demo of the tools plus a consultation with an analysis of your business (a call after email feedback). After that you pay for the build around your niche and monthly support.",
      },
      {
        question: "Where is my data stored?",
        answer: "AWS encrypted, GDPR compliant — your data stays yours.",
      },
    ],
  },

  finalCta: {
    title: "Start automating right now",
    subtitle: "Join 50+ companies already running on AI Integrator",
    cta: "Get a free audit →",
    trust: [
      "No credit card required",
      "Results in 72 hours, guaranteed",
      "Free analysis tailored to you (call after email feedback)",
    ],
    contactLead: "Or reach out directly: Telegram",
    emailLabel: "Email",
    phoneLabel: "Phone",
  },

  footer: {
    tagline: "Making AI work for everyone",
    productTitle: "Product",
    contactsTitle: "Contacts",
    links: [
      { href: "#features", label: "Apps" },
      { href: "#pricing", label: "Pricing" },
      { href: "#how-it-works", label: "How it works" },
      { href: "#results", label: "Results" },
    ],
  },

  form: {
    emailLabel: "Email",
    placeholder: "Your email",
    required: "Enter your email",
    invalid: "Enter a valid email",
    submitting: "Sending…",
    genericError: "Something went wrong. Please try again.",
    networkError: "Network error. Please try again.",
  },

  pro: {
    cta: "Get PRO",
  },

  appPages: {
    poaching: {
      metaTitle: "Poaching — win customers from your competitors | AI Integrator",
      metaDescription:
        "Name your niche and Poaching finds people who were shopping your competitors, scores them, and drafts a tactful DM.",
      badge: "Poaching",
      titleLead: "Poaching — ",
      titleAccent: "hunting your competitors' customers",
      subtitle:
        "People asking questions under your competitors' posts are already warm leads. Name your niche and the engine finds them, then shows you how to win them over tactfully.",
    },
    bizdoctor: {
      metaTitle: "BizDoctor — business diagnostics | AI Integrator",
      metaDescription:
        "Tell us about your business and metrics — BizDoctor shows where the money leaks and gives concrete fixes with projected impact.",
      badge: "BizDoctor",
      titleLead: "BizDoctor — ",
      titleAccent: "where you're losing money",
      subtitle:
        "Tell us about your business — the doctor asks about your key metrics, makes a diagnosis, and shows what to fix first.",
      pro: {
        title: "BizDoctor PRO — from diagnosis to treatment",
        intro:
          "In the PRO version the doctor doesn't stop at the diagnosis: it connects to your metrics and follows every problem through to a solution:",
        features: [
          "Grafana integration — dashboards and metrics pulled in directly",
          "Research into proven solutions and practices for each problem found",
          "Matching you with the right expert or contractor for the job",
          "Tracking how your metrics move after you apply the recommendations",
        ],
      },
      disclaimer:
        "The diagnosis is an analytical assessment, not financial advice. Your data is not stored.",
    },
    coldmessage: {
      metaTitle: "ColdMessage Pro — cold email personalization | AI Integrator",
      metaDescription:
        "Paste a profile and AI pulls out the contacts, events, and interests, then rewrites your boilerplate pitch into a warm personalized message.",
      badge: "ColdMessage Pro",
      titleLead: "ColdMessage Pro — ",
      titleAccent: "personalization from a template",
      subtitle:
        "Paste a profile and your template pitch. AI extracts the person's contacts, recent events, and interests, then rewrites your message around them — with the right hook and angle.",
      pro: {
        title: "ColdMessage PRO — on autopilot",
        intro:
          "In the PRO version the busywork disappears: profiles are collected and analyzed automatically, and leads warm up on their own:",
        features: [
          "Automatic profile scraping from a link — no manual pasting",
          "Deep activity analysis: posts, comments, interests",
          "Automated warm-up: a touch sequence that runs until they're sales-ready",
          "Bulk personalization: hundreds of emails from a single contact list",
        ],
      },
      disclaimer:
        "Profile data is used only to generate the message and is not stored. Check the facts before you send.",
    },
    objectionkiller: {
      metaTitle: "ObjectionKiller — handle customer objections | AI Integrator",
      metaDescription:
        "Describe the situation and the objection. AI clarifies the context, uncovers the real reason, and hands you ready-to-use response tactics.",
      badge: "ObjectionKiller",
      titleLead: "ObjectionKiller — ",
      titleAccent: "closing objections",
      subtitle:
        "Describe the situation and the customer's objection. The assistant asks for details, uncovers the real reason behind it, and tells you how to respond — with ready-made wording.",
      pro: {
        title: "ObjectionKiller PRO — training mode",
        intro:
          "In the PRO version the assistant becomes a sparring partner: it plays your customer while you practice closing objections:",
        features: [
          "Text sparring: an AI customer with a personality and real objections from your niche",
          "Voice mode: answer out loud, just like a real call",
          "Post-round breakdown: what landed and where you lost the deal",
          "A scenario library built around your niche and product",
        ],
      },
      disclaimer:
        "The responses are recommendations, not a guaranteed close. Adapt the wording to your own style and customer.",
    },
    personachannel: {
      metaTitle: "PersonaChannel — content for your persona | AI Integrator",
      metaDescription:
        "Describe your channel and audience — PersonaChannel builds the persona profile and writes 5 ready posts that keep exactly that person around.",
      badge: "PersonaChannel",
      titleLead: "PersonaChannel — ",
      titleAccent: "content for your persona",
      subtitle:
        "A channel retains people when every post hits one specific persona's pain points. Describe your channel and get an audience profile plus 5 ready posts written for them.",
    },
    followupbot: {
      metaTitle: "FollowUpBot — lead follow-up sequences | AI Integrator",
      metaDescription:
        "Describe where the conversation stalled — FollowUpBot writes a 3-message follow-up sequence, each with a different angle.",
      badge: "FollowUpBot",
      titleLead: "FollowUpBot — ",
      titleAccent: "follow-ups without the pressure",
      subtitle:
        "Half of all deals die because nobody followed up. Describe the situation and get a sequence of 3 messages, each taking a different angle.",
      pro: {
        title: "FollowUpBot PRO — real email integration",
        intro:
          "In the PRO version the bot connects straight to your inbox and works on its own, no copy-pasting:",
        features: [
          "Direct Gmail/Outlook connection over OAuth — access to the thread",
          "Automatic inbox parsing: the bot spots where a customer went quiet",
          "Follow-ups go out on schedule — no manual triggering",
          "AI-suggested replies for every incoming customer email",
        ],
      },
    },
    inboxzero: {
      metaTitle: "InboxZero — clear your inbox in minutes | AI Integrator",
      metaDescription:
        "Paste an incoming email — InboxZero classifies it, pulls out the action items, and drafts a reply in the right tone.",
      badge: "InboxZero",
      titleLead: "InboxZero — ",
      titleAccent: "your inbox in 15 minutes",
      subtitle:
        "Paste an email and get its classification, the gist, the action items inside it, and a ready reply. Two hours of inbox triage becomes 15 minutes.",
      pro: {
        title: "InboxZero PRO — real email integration",
        intro:
          "In the PRO version InboxZero connects straight to your mailbox and triages your email in real time, on its own:",
        features: [
          "Direct Gmail/Outlook connection — no copying emails by hand",
          "Automatic triage of every incoming email as it arrives",
          "AI-suggested reply for each one — approve and send",
          "Prioritization: important on top, newsletters and spam archived",
        ],
      },
      disclaimer:
        "Emails are processed only to generate the reply and are not stored.",
    },
    leadradar: {
      metaTitle: "LeadRadar — find leads on Threads by keyword | AI Integrator",
      metaDescription:
        "Enter a keyword and LeadRadar finds and qualifies prospects on Threads: hot / warm / not a lead, with a score and a draft opener.",
      badge: "LeadRadar",
      titleLead: "LeadRadar — ",
      titleAccent: "hunting leads on Threads",
      subtitle:
        "Enter a keyword or a niche — the engine finds people posting about it on Threads and scores each one as a lead: hot, warm, or not worth it.",
    },
    commenthunter: {
      metaTitle: "Comment Hunter — leads hiding in post comments | AI Integrator",
      metaDescription:
        "Enter a topic and Comment Hunter finds popular posts, then pulls hot leads out of the comments under them, with a score and a ready reply.",
      badge: "Comment Hunter",
      titleLead: "Comment Hunter — ",
      titleAccent: "leads from the comments",
      subtitle:
        "Hot prospects often hide in the comments rather than the posts. Enter a topic and the engine scans the comments and pulls out leads who are ready to be contacted.",
    },
    trendsniper: {
      metaTitle: "Trend Sniper — trend analytics by region | AI Integrator",
      metaDescription:
        "Enter a topic and Trend Sniper scores the level of interest, the trend direction, the top regions, and related queries, Google Trends style.",
      badge: "Trend Sniper",
      titleLead: "Trend Sniper — ",
      titleAccent: "demand analytics by region",
      subtitle:
        "Enter a topic and the engine shows the level of interest, where the trend is heading, which regions are strongest, and which related queries are growing.",
      pro: {
        title: "Trend Sniper PRO — community scraping by topic",
        intro:
          "In the PRO version the engine finds and monitors live discussions on your topic on its own — not just numbers, but the actual communities:",
        features: [
          "Auto-discovery of groups and communities on your topic across Telegram, VK, Facebook, and Reddit",
          "Continuous monitoring of new posts and discussions — no manual searching",
          "A list of active communities with reach and engagement levels",
          "Real-time alerts when activity around your topic spikes",
        ],
      },
    },
  },

  thankYou: {
    metaTitle: "Thank you! — AI Integrator",
    title: "Request received!",
    subtitle:
      "We'll get back to you within 24 hours and run a free diagnosis of your business.",
    cta: "← Back to home",
  },
};
