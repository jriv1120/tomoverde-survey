export type QuestionType = "single" | "multi" | "text" | "optional-text";

export interface Question {
  id: string;
  column: string;
  type: QuestionType;
  number: number;
  prompt: string;
  subtitle?: string;
  options?: string[];
  placeholder?: string;
  optional?: boolean;
}

export const QUESTIONS: Question[] = [
  {
    id: "identity",
    column: "identity",
    type: "single",
    number: 1,
    prompt: "Which of these describes you best?",
    options: [
      "Canna-curious — still figuring it out",
      "Social user — mostly weekends and with friends",
      "Daily integrator — part of my wellness routine",
      "Connoisseur — I care about strain, grower, terpenes",
      "Sober-curious — here for the community, not the consumption",
    ],
  },
  {
    id: "vibe_word",
    column: "vibe_word",
    type: "single",
    number: 2,
    prompt: "When you imagine the perfect cannabis event, which word fits first?",
    options: ["Chill", "Social", "Wellness", "Elevated / luxury", "Creative", "Educational"],
  },
  {
    id: "event_types",
    column: "event_types",
    type: "multi",
    number: 3,
    prompt: "What types of events would you actually show up to?",
    subtitle: "Pick as many as feel right.",
    options: [
      "Sesh + dinner (shared meal, small group)",
      "Yoga, breathwork, or sound bath",
      "Outdoor hikes or park hangs",
      "Live music or DJ sets",
      "Comedy, open mic, or storytelling",
      "Art, painting, or pottery workshops",
      "Grower meet-and-greets or terpene tastings",
      "Women-only or queer-only spaces",
      "Cannabis + wellness retreats (full day / weekend)",
      "Industry mixers or networking",
      "Policy and advocacy events",
    ],
  },
  {
    id: "blockers",
    column: "blockers",
    type: "multi",
    number: 4,
    prompt: "What's stopped you from attending a cannabis event in the past?",
    options: [
      "Didn't know any existed near me",
      "Unclear what the vibe would be",
      "Going alone felt awkward",
      "Worried about who'd be there",
      "Price / too expensive",
      "Location too far",
      "Legal or job concerns",
      "None — I haven't tried one yet",
    ],
  },
  {
    id: "consumption_formats",
    column: "consumption_formats",
    type: "multi",
    number: 5,
    prompt: "How do you prefer to consume at events?",
    options: [
      "Flower (pre-rolls, joints)",
      "Edibles",
      "Beverages",
      "Vapes or concentrates",
      "Topicals only",
      "I'd rather not consume — just be around the community",
    ],
  },
  {
    id: "social_unit",
    column: "social_unit",
    type: "single",
    number: 6,
    prompt: "Who are you most likely to bring?",
    options: [
      "Going solo to meet people",
      "A close friend or two",
      "My partner / date night",
      "A larger group (4+)",
      "Depends on the event",
    ],
  },
  {
    id: "event_size",
    column: "event_size",
    type: "single",
    number: 7,
    prompt: "What size feels right?",
    options: [
      "Intimate (under 15)",
      "Small group (15–40)",
      "Medium (40–100)",
      "Big energy (100+)",
    ],
  },
  {
    id: "price_band",
    column: "price_band",
    type: "single",
    number: 8,
    prompt: "How much would you pay for a single event you were excited about?",
    options: [
      "Free or donation",
      "$10–25",
      "$25–50",
      "$50–100",
      "$100+ for the right experience",
    ],
  },
  {
    id: "frequency",
    column: "frequency",
    type: "single",
    number: 9,
    prompt: "How often would you attend if the right events existed nearby?",
    options: [
      "Weekly",
      "2–3x per month",
      "Monthly",
      "A few times a year",
      "Just for special occasions",
    ],
  },
  {
    id: "discovery_channels",
    column: "discovery_channels",
    type: "multi",
    number: 10,
    prompt: "Where do you currently hear about cannabis events?",
    options: [
      "Instagram",
      "TikTok",
      "Friends / word of mouth",
      "Dispensary staff",
      "Eventbrite or event platforms",
      "Reddit",
      "I don't — I wish I did",
    ],
  },
  {
    id: "trust_drivers",
    column: "trust_drivers",
    type: "multi",
    number: 11,
    prompt: "What would make you trust a cannabis event brand?",
    options: [
      "Photos and videos from past events",
      "Reviews from attendees",
      "Knowing the hosts or organizers",
      "Safety and consent policies",
      "Diverse crowd represented",
      "Licensed venue",
      "Clear price and what's included",
    ],
  },
  {
    id: "ideal_event_freeform",
    column: "ideal_event_freeform",
    type: "text",
    number: 12,
    prompt: "In your own words — what would your ideal cannabis event feel like?",
    placeholder: "Think vibe, not logistics. Let it breathe.",
  },
  {
    id: "zip_code",
    column: "zip_code",
    type: "optional-text",
    number: 13,
    prompt: "What's your zip code?",
    subtitle: "So we can start planning events near you.",
    placeholder: "07030",
    optional: true,
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
