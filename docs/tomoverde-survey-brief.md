# Tomoverde — Event Survey Build Brief

We're building a web application based on Next.js and Tailwind. The application will be deployed on GitHub and Vercel, with Supabase for the database.

---

## WHAT WE'RE BUILDING

A beautifully designed survey page for **Tomoverde** (the rebrand of Cannavue) that asks people what kind of cannabis events they actually want — so we can shape our event programming around real demand instead of guesses.

**Brand context:** Tomoverde = Tomo (friendship, Japanese) + Verde (green, Spanish). The vibe is friendship, community, welcoming, discovering, coming together, advocating, wellness. It is a **deliberate departure** from Cannavue's dark-luxury aesthetic toward something more botanical, warm, and sanctuary-feeling.

---

## PAGES / VIEWS

1. **`/` — Landing page.** Tomoverde hero, a short brand intro ("Tomo means friendship. Verde means green. We're building a cannabis community that feels like coming home, not a transaction."), and a single "Start the survey" CTA. Keep it spacious.

2. **`/survey` — The survey flow.** One question at a time, full-screen, mobile-first. Progress bar pinned to the top. Smooth fade/slide transitions between questions. Next / Back buttons. Partial responses saved to localStorage so users can close and return. Questions 13 and 14 (zip + email) are optional and clearly marked as such.

3. **`/thanks` — Confirmation page.** Warm thank-you copy ("Your voice is the first seed planted in this garden"), social share buttons (IG, TikTok, X, copy-link), and a subtle "Follow our journey" CTA pointing to @tomoverde.

No admin view needed — responses will be viewed directly in the Supabase dashboard.

---

## DATA

Create a Supabase table `survey_responses` with these columns:

| column | type | notes |
|---|---|---|
| `id` | uuid | primary key, default `gen_random_uuid()` |
| `created_at` | timestamptz | default `now()` |
| `identity` | text | Q1 |
| `vibe_word` | text | Q2 |
| `event_types` | text[] | Q3 (multi-select) |
| `blockers` | text[] | Q4 (multi-select) |
| `consumption_formats` | text[] | Q5 (multi-select) |
| `social_unit` | text | Q6 |
| `event_size` | text | Q7 |
| `price_band` | text | Q8 |
| `frequency` | text | Q9 |
| `discovery_channels` | text[] | Q10 (multi-select) |
| `trust_drivers` | text[] | Q11 (multi-select) |
| `ideal_event_freeform` | text | Q12 (open-ended) |
| `zip_code` | text | Q13, optional |
| `email` | text | Q14, optional |
| `user_agent` | text | auto-captured |
| `referrer` | text | auto-captured |

**RLS policies:** Allow anonymous `INSERT` only. Block `SELECT` except via service role. (Protects against scrapers harvesting emails.)

---

## THE 12 QUESTIONS

**Q1. Which of these describes you best?** *(single select)*
- Canna-curious — still figuring it out
- Social user — mostly weekends and with friends
- Daily integrator — part of my wellness routine
- Connoisseur — I care about strain, grower, terpenes
- Sober-curious — here for the community, not the consumption

**Q2. When you imagine the perfect cannabis event, which word fits first?** *(single select)*
- Chill
- Social
- Wellness
- Elevated / luxury
- Creative
- Educational

**Q3. What types of events would you actually show up to?** *(multi-select)*
- Sesh + dinner (shared meal, small group)
- Yoga, breathwork, or sound bath
- Outdoor hikes or park hangs
- Live music or DJ sets
- Comedy, open mic, or storytelling
- Art, painting, or pottery workshops
- Grower meet-and-greets or terpene tastings
- Women-only or queer-only spaces
- Cannabis + wellness retreats (full day / weekend)
- Industry mixers or networking
- Policy and advocacy events

**Q4. What's stopped you from attending a cannabis event in the past?** *(multi-select)*
- Didn't know any existed near me
- Unclear what the vibe would be
- Going alone felt awkward
- Worried about who'd be there
- Price / too expensive
- Location too far
- Legal or job concerns
- None — I haven't tried one yet

**Q5. How do you prefer to consume at events?** *(multi-select)*
- Flower (pre-rolls, joints)
- Edibles
- Beverages
- Vapes or concentrates
- Topicals only
- I'd rather not consume — just be around the community

**Q6. Who are you most likely to bring?** *(single select)*
- Going solo to meet people
- A close friend or two
- My partner / date night
- A larger group (4+)
- Depends on the event

**Q7. What size feels right?** *(single select)*
- Intimate (under 15)
- Small group (15–40)
- Medium (40–100)
- Big energy (100+)

**Q8. How much would you pay for a single event you were excited about?** *(single select)*
- Free or donation
- $10–25
- $25–50
- $50–100
- $100+ for the right experience

**Q9. How often would you attend if the right events existed nearby?** *(single select)*
- Weekly
- 2–3x per month
- Monthly
- A few times a year
- Just for special occasions

**Q10. Where do you currently hear about cannabis events?** *(multi-select)*
- Instagram
- TikTok
- Friends / word of mouth
- Dispensary staff
- Eventbrite or event platforms
- Reddit
- I don't — I wish I did

**Q11. What would make you trust a cannabis event brand?** *(multi-select)*
- Photos and videos from past events
- Reviews from attendees
- Knowing the hosts or organizers
- Safety and consent policies
- Diverse crowd represented
- Licensed venue
- Clear price and what's included

**Q12. In your own words — what would your *ideal* cannabis event feel like?** *(open-ended text area)*

**Q13. *Optional:* What's your zip code?** *(so we can start planning events near you)*

**Q14. *Optional:* Drop your email to be the first to know about events in your area.**

---

## CORE FEATURES (in user terms)

- A visitor opens the landing page and immediately feels sanctuary — not a dispensary.
- One tap on "Start the survey" moves them into question 1 full-screen with a progress bar showing 1/14.
- Single-select questions auto-advance after a ~400ms delay so the flow feels like breathing, not clicking.
- Multi-select options visually "fill in" when tapped and show a "Continue" button once anything is selected.
- Free-text has a simple, generous text area with soft placeholder copy.
- Back and Next navigation. Partial responses save to localStorage every time an answer changes.
- On submit, the response is written to Supabase and the user lands on the warm thank-you page.
- All the way through: keyboard-navigable, screen-reader labels, no jargon.

---

## VISUAL STYLE

This is a deliberate rebrand **away from** Cannavue's dark-luxury palette (deep green `#1B5E20`, metallic gold `#C6A355`, pure black backgrounds). Tomoverde is warmer, more botanical, and community-oriented.

**Mood board (4 cosmos.so references attached):**
1. Stone stepping stones through lush tree ferns — *discovery, path, natural materials*
2. Garden sanctuary with koi pond, moss, ivy-covered gate — *peace, refuge, a place to meet*
3. Cosmic green sky over red rock spires — *wonder, imagination, otherworldly*
4. Airy botanical lounge with cream, beige, palms, warm wood — *welcoming social space, gather, share*

**Color direction:**
- **Primary green:** shift from fluorescent cannabis green to deeper mossy sanctuary greens. Think fern, forest, moss. Suggested base: `#2D4A3A` or similar — pick something that feels *grown*, not manufactured.
- **Secondary warm:** terracotta, cream, soft natural wood tones. *No metallic gold.* Replace it with a muted ochre or soft amber.
- **Backgrounds:** can still be dark for contrast on the survey screens, but use deep forest greens and charcoals rather than pure black. Sanctuary, not luxury.
- **Accent:** a subtle bioluminescent green glow is OK sparingly for hover states and the progress bar — echo image #3's cosmic feel.

**Typography:**
- Headings: a warm, literary serif (think invitation card, not corporate deck). Suggestions: Fraunces, Cormorant, or GT Sectra if available.
- Body: clean humanist sans. Inter, General Sans, or similar.

**Animations:**
- Slow, breathing, organic. Transitions 500–700ms with ease-out curves.
- Leaves-settling feel, not snappy. Make it feel like an exhale.
- Progress bar fills with a soft glow, not a hard jump.

**Micro-copy personality:**
- Warm, curious, welcoming. First-person plural ("we're building", "help us shape this").
- No industry jargon. No "experience" as a marketing word. No "elevated."
- Speak like a friend inviting someone over, not a brand pitching a product.

**Reference the `cannavue-frontend` skill** for component patterns and animation conventions, but **override the color system** per the Tomoverde direction above. The component architecture carries over — the palette does not.

---

## ADDITIONAL REQUIREMENTS

- **No password protection.** This survey is public.
- **Mobile-first.** It must feel incredible on an iPhone.
- **Share CTA** on the thanks page: IG + copy-link at minimum.
- **No email service integration** for v1. Emails just go into the Supabase table.
- **Accessibility:** keyboard navigable, screen-reader labels on all inputs, sufficient color contrast.
- **Favicon + OG share image** reflecting the Tomoverde brand (botanical, sanctuary, green).
- **Analytics:** add Vercel Analytics out of the box. Don't add GA or anything else.

---

## INFRASTRUCTURE

Use the GitHub, Vercel, and Supabase MCP connectors to:

1. Create a new GitHub repository named `tomoverde-survey` under Jorge's account.
2. Spin up a new Supabase project with the `survey_responses` table and the RLS policies described above.
3. Deploy to Vercel with a live URL.
4. Set up env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. After deploy, run a single test submission end-to-end and confirm the row appears in Supabase before handing off.

Please scaffold the full app, set up the infrastructure, deploy, and report back with the live URL + the Supabase project URL.
