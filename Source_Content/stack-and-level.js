// ============================================================
// STACK AND LEVEL — EVENT CONTENT
// Transcribed verbatim from:
//   Stack_and_Level_TECHNOFEST_2026_Rules and Instruction.docx
//   (Department of CSE · TECHNOFEST 2026 · Technical Event)
// Round timings come from: Stack And Level event Technofest Rules and Timing.docx
//
// Edit here, then run `npm run content:extract` in web/.
// scripts/audit-content.mjs re-reads the .docx and fails if any sentence
// from the document is missing from the rendered site.
// ============================================================

const GENERAL_RULES = [
  "A laptop is optional. Teams may use the lab computer provided, and each team competes on one device only.",
  "The event consists of three levels, gradually increasing in difficulty: Bug Bounty, Sight Unseen and Buzz or Bust.",
  "Participants compete in teams of 1 to 4 members. Registration is spot registration only, at the venue.",
  "Mobile phones are strictly prohibited as a second device in every level.",
  "Discussion is allowed only within your own team. Talking to or helping other teams is not allowed.",
  "The decision of the event coordinators and judges will be final.",
];

const LEVELS = [
  {
    id: "bug-bounty",
    number: "Level 01",
    name: "Bug Bounty",
    kind: "Debugging Round",
    svgIcon: "bug",
    // Short lead-in written for the site; every factual claim is in `rules` below.
    tagline: "Ten broken programs. Ten minutes. Five languages.",
    duration: "10 minutes",
    format: "Lab 1 + Lab 2 · 10 teams per lab",
    qualifier: "Top 5 teams from each lab advance",
    rules: [
      "Teams will be given 10 broken programs to fix within 10 minutes. The programs cover:",
      "Easy, Medium and Hard difficulty levels.",
      "C, C++, Java, Python and JavaScript.",
      "Each program must be fixed in the language it is written in.",
      "The round runs in Lab 1 and Lab 2 at the same time, with 10 teams in each lab.",
      "The top 5 teams from each lab will qualify for the next level.",
    ],
    scoring: [
      { label: "Points", text: "Each solved question earns 100 points, dropping by 10 every minute, down to a minimum of 10." },
      { label: "Difficulty", text: "All questions carry the same points. Wrong submissions cost nothing." },
      { label: "Tie", text: "Broken by total solving time." },
    ],
  },
  {
    id: "sight-unseen",
    number: "Level 02",
    name: "Sight Unseen",
    kind: "AI Prompting Round",
    svgIcon: "eye",
    tagline: "Watch a website once. Rebuild it from memory.",
    duration: "5 minutes observation + 35 minutes build",
    format: "Projector reveal · AI tools allowed",
    qualifier: "Top 5 teams advance",
    rules: [
      "A live website will be shown on the projector only once, for 5 minutes.",
      "Teams may take written notes, but photos or recordings of the website are not allowed.",
      "Teams then get 35 minutes to rebuild the website from memory using an AI tool.",
      "AI tools and internet access are allowed in this level.",
      "The top 5 teams will advance to the final level.",
    ],
    scoring: [
      { label: "Scale", text: "Each category is scored from 0 to 10, for a maximum of 50." },
      { label: "Layout, Colors, Animations, Contents", text: "How closely the rebuild matches the original website." },
      { label: "Prompt", text: "Fewer and clearer prompts score higher." },
    ],
  },
  {
    id: "buzz-or-bust",
    number: "Level 03",
    name: "Buzz or Bust",
    kind: "Buzzer Round",
    svgIcon: "buzzer",
    tagline: "Buzz first, code offline, or lose the points anyway.",
    duration: "10 minutes per question · 5 questions",
    format: "Offline editor only · buzzer start",
    qualifier: "Top 3 teams are declared winners",
    rules: [
      "Every team starts with 100 points, and scores carry across all 5 questions.",
      "Each question shows an expected output or a problem to build.",
      "The first three teams to press the buzzer get to code. The other two sit out that question.",
      "The three teams get 10 minutes to code offline, using only a notepad or offline editor, and must run their code to show the output.",
      "The top three teams with the highest total score will be declared winners.",
    ],
    scoring: [
      { label: "Buzzing in", text: "Costs 20 points immediately." },
      { label: "Output", text: "Judges rank the three attempts by correctness. 1st gets 20 points back, 2nd gets 15, 3rd gets 10." },
      { label: "Not buzzing in", text: "Costs 20 points for that question." },
    ],
  },
];

const REGULATIONS = [
  "Teams must complete each level within the given time limit.",
  "In Bug Bounty, every fix must genuinely work. It is re-tested with hidden data, so printing the answer will be rejected.",
  "A solved question locks in, and its points cannot be lost.",
  "A team must solve at least one question in Bug Bounty to qualify.",
  "Keep your Team ID safe. It is needed to rejoin if your device disconnects.",
  "Tampering with lab equipment, the network or the buzzer system will lead to disqualification from the entire event.",
];

const CODE_OF_CONDUCT = [
  "Respect event coordinators, fellow participants, and judges.",
  "Fair play is mandatory; copying, sharing answers or any unethical behaviour will lead to disqualification.",
  "No internet, AI tools or outside help in Bug Bounty and Buzz or Bust.",
];

const WINNING = [
  "The top three teams with the highest cumulative scores in Buzz or Bust will be declared winners.",
  "In case of a tie, the event coordinators and judges will decide the final standing.",
];

// Prizes (supplied by the organisers, not in the rules document).
const PRIZES = [
  { place: "1st", position: "First Prize", amount: "₹1,500", extra: "with certificate" },
  { place: "2nd", position: "Second Prize", amount: "₹1,000", extra: "with certificate" },
  { place: "3rd", position: "Third Prize", amount: "₹750", extra: "with certificate" },
];

// Team funnel, derived from the round details above.
const PROGRESSION = [
  { stage: "Bug Bounty", teams: "20 teams", detail: "10 teams in Lab 1, 10 teams in Lab 2" },
  { stage: "Sight Unseen", teams: "10 teams", detail: "Top 5 from each lab" },
  { stage: "Buzz or Bust", teams: "5 teams", detail: "Top 5 from Sight Unseen" },
  { stage: "Winners", teams: "3 teams", detail: "Highest cumulative scores" },
];

// Every answer below is traceable to the rules document or config.js.
const FAQ = [
  {
    q: "How do I register for Stack and Level?",
    a: "<strong>Registration is spot registration only, at the venue.</strong> You can also pre-register through the Technofest 2026 form so we know you are coming — but the team you compete with is confirmed at the venue on the day.",
  },
  {
    q: "How many people can be in a team?",
    a: "Participants compete in <strong>teams of 1 to 4 members</strong>. You can enter alone or with up to three teammates.",
  },
  {
    q: "Do I need to bring a laptop?",
    a: "A laptop is optional. Teams may use the lab computer provided, and <strong>each team competes on one device only</strong>.",
  },
  {
    q: "Can I use my phone during the event?",
    a: "No. <strong>Mobile phones are strictly prohibited as a second device in every level.</strong>",
  },
  {
    q: "Are AI tools and the internet allowed?",
    a: "Only in <strong>Sight Unseen</strong>, where AI tools and internet access are allowed. There is <strong>no internet, AI tools or outside help in Bug Bounty and Buzz or Bust</strong>.",
  },
  {
    q: "How do teams qualify for the next level?",
    a: "In Bug Bounty the <strong>top 5 teams from each lab</strong> qualify, and a team must solve at least one question to qualify at all. In Sight Unseen the <strong>top 5 teams</strong> advance to the final level.",
  },
  {
    q: "What happens if my device disconnects?",
    a: "Keep your <strong>Team ID</strong> safe — it is needed to rejoin if your device disconnects.",
  },
  {
    q: "Which languages do the Bug Bounty programs use?",
    a: "The 10 broken programs cover <strong>C, C++, Java, Python and JavaScript</strong>, across Easy, Medium and Hard difficulty levels. Each program must be fixed in the language it is written in.",
  },
  {
    q: "How are the winners decided?",
    a: "The <strong>top three teams with the highest cumulative scores in Buzz or Bust</strong> will be declared winners. In case of a tie, the event coordinators and judges will decide the final standing.",
  },
  {
    q: "What do the winners get?",
    a: "First prize is <strong>₹1,500</strong>, second prize is <strong>₹1,000</strong> and third prize is <strong>₹750</strong> — each awarded with a certificate.",
  },
];

if (typeof module !== "undefined") {
  module.exports = { GENERAL_RULES, LEVELS, REGULATIONS, CODE_OF_CONDUCT, WINNING, PRIZES, PROGRESSION, FAQ };
}
