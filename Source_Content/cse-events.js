// ============================================================
// TECHNOFEST-3.0 2026 — DEPARTMENT OF CSE EVENTS
// Rules transcribed verbatim from:
//   Source_Content/Technofest_3.0_CSE_Rules.docx
// (generated from the document; presentation metadata added by hand)
//
// Edit here, then run `npm run content:extract` in web/.
// scripts/audit-content.mjs re-reads the .docx and fails if any sentence
// from the document is missing from the rendered site.
// ============================================================

const EVENTS = [
  {
    id: "stack-and-level",
    name: "Stack and Level",
    category: "Technical",
    svgIcon: "terminal",
    tagline: "Debug it. Rebuild it. Buzz for it.",
    summary: "Three levels, one device, and difficulty that climbs with every round. Fix ten broken programs against the clock, rebuild a website you only saw once, then out-buzz the teams still standing.",
    teamSize: "1 to 4 members",
    facts: [
      { label: "Levels", value: "3" },
      { label: "Team size", value: "1 to 4 members" },
      { label: "Runs in", value: "Block A — Lab 1 and Lab 2" },
      { label: "Registration", value: "Spot registration at the venue" },
    ],
    generalRules: [
      "A laptop is optional. Teams may use the lab computer provided, and each team competes on one device only.",
      "The event consists of three levels, gradually increasing in difficulty: Bug Bounty, Sight Unseen and Buzz or Bust.",
      "Participants compete in teams of 1 to 4 members. Registration is spot registration only, at the venue.",
      "Mobile phones are strictly prohibited as a second device in every level.",
      "Discussion is allowed only within your own team. Talking to or helping other teams is not allowed.",
      "The decision of the event coordinators and judges will be final.",
    ],
    rounds: [
      {
        number: "Level 1",
        name: "Bug Bounty",
        kind: "Debugging Round",
        rules: [
          "Teams will be given 10 broken programs to fix within 10 minutes. The programs cover:",
          "Easy, Medium and Hard difficulty levels.",
          "C, C++, Java, Python and JavaScript.",
          "Each program must be fixed in the language it is written in.",
          "The round runs in Lab 1 and Lab 2 at the same time, with 10 teams in each lab.",
          "The top 5 teams from each lab will qualify for the next level",
        ],
        games: [],
      },
      {
        number: "Level 2",
        name: "Sight Unseen",
        kind: "AI Prompting Round",
        rules: [
          "A live website will be shown on the projector only once, for 5 minutes.",
          "Teams may take written notes, but photos or recordings of the website are not allowed.",
          "Teams then get 35 minutes to rebuild the website from memory using an AI tool.",
          "AI tools and internet access are allowed in this level.",
          "The top 5 teams will advance to the final level.",
        ],
        games: [],
      },
      {
        number: "Level 3",
        name: "Buzz or Bust",
        kind: "Buzzer Round",
        rules: [
          "Every team starts with 100 points, and scores carry across all 5 questions.",
          "Each question shows an expected output or a problem to build.",
          "The first three teams to press the buzzer get to code. The other two sit out that question.",
          "The three teams get 10 minutes to code offline, using only a notepad or offline editor, and must run their code to show the output.",
          "The top three teams with the highest total score will be declared winners.",
        ],
        games: [],
      },
    ],
    scoring: [
      {
        level: "Level 1",
        items: [
          { label: "Points", text: "Each solved question earns 100 points, dropping by 10 every minute, down to a minimum of 10." },
          { label: "Difficulty", text: "All questions carry the same points. Wrong submissions cost nothing." },
          { label: "Tie", text: "Broken by total solving time." },
        ],
      },
      {
        level: "Level 2",
        items: [
          { label: "Scale", text: "Each category is scored from 0 to 10, for a maximum of 50." },
          { label: "Layout, Colours, Animations, Contents", text: "How closely the rebuild matches the original website." },
          { label: "Prompt", text: "Fewer and clearer prompts score higher." },
        ],
      },
      {
        level: "Level 3",
        items: [
          { label: "Buzzing in", text: "Costs 20 points immediately." },
          { label: "Output", text: "Judges rank the three attempts by correctness. 1st gets 20 points back, 2nd gets 15, 3rd gets 10." },
          { label: "Not buzzing in", text: "Costs 20 points for that question." },
        ],
      },
    ],
    regulations: [
      "Teams must complete each level within the given time limit.",
      "In Bug Bounty, every fix must genuinely work. It is re-tested with hidden data, so printing the answer will be rejected.",
      "A solved question locks in, and its points cannot be lost.",
      "A team must solve at least one question in Bug Bounty to qualify.",
      "Keep your Team ID safe. It is needed to rejoin if your device disconnects.",
      "Tampering with lab equipment, the network or the buzzer system will lead to disqualification from the entire event.",
    ],
    conduct: [
      "Respect event coordinators, fellow participants, and judges.",
      "Fair play is mandatory; copying, sharing answers or any unethical behaviour will lead to disqualification.",
      "No internet, AI tools or outside help in Bug Bounty and Buzz or Bust.",
    ],
    winning: [
      "The top three teams with the highest cumulative scores in Buzz or Bust will be declared winners.",
      "In case of a tie, the event coordinators and judges will decide the final standing.",
    ],
    prizes: [
      { place: "1st", position: "First Prize", amount: "₹1,500", extra: "with certificate" },
      { place: "2nd", position: "Second Prize", amount: "₹1,000", extra: "with certificate" },
      { place: "3rd", position: "Third Prize", amount: "₹750", extra: "with certificate" },
    ],
    progression: [
      { stage: "Bug Bounty", teams: "20 teams", detail: "10 teams in Lab 1, 10 teams in Lab 2" },
      { stage: "Sight Unseen", teams: "10 teams", detail: "Top 5 from each lab" },
      { stage: "Buzz or Bust", teams: "5 teams", detail: "Top 5 from Sight Unseen" },
      { stage: "Winners", teams: "3 teams", detail: "Highest cumulative scores" },
    ],
  },
  {
    id: "the-reckoning",
    name: "The Reckoning",
    category: "Non-Technical",
    svgIcon: "target",
    tagline: "Ten games. Two players. One team left standing.",
    summary: "A knockout run of party games for pairs — guessing, balancing, sketching and throwing — narrowing down through The Showdown and The Final Strike to a head-to-head Final Clash.",
    teamSize: "2 members",
    facts: [
      { label: "Rounds", value: "4" },
      { label: "Games", value: "10" },
      { label: "Team size", value: "2 members" },
      { label: "Decided by", value: "The Final Clash" },
    ],
    generalRules: [
      "Participants will compete in teams of 2 members.",
      "Each team must follow the rules and instructions given for the respective game.",
      "Participants must complete each challenge within the given time limit.",
      "Fair play is mandatory. Copying, sharing answers, or any unethical behaviour will lead to disqualification.",
      "The decision of the event coordinators and judges will be final.",
    ],
    rounds: [
      {
        number: null,
        name: "Round 1",
        kind: null,
        rules: [],
        games: [
            {
              name: "WORD WARRIORS",
              note: "",
              rules: [
                "Each team consists of 2 members. One member will be given a secret word, while the other member has to guess it.",
                "The member who knows the word must guide their teammate using verbal instructions and actions without directly saying the word.",
                "The guessing player must perform the actions based on the instructions and identify the given word.",
                "Players are not allowed to spell, say, or directly reveal any part of the given word or use similar words as clues.",
                "Each team will have 1 minute to guess the given word correctly. The team that successfully guesses the word within the time limit will win the round.",
              ],
            },
            {
              name: "BALANCE BREAKERS",
              note: "",
              rules: [
                "Each team consists of 2 members, and each team will play the game individually.",
                "The cups will be arranged in a pyramid formation, with a mini ball placed on the top cup.",
                "Players must use the inflated balloon to move and transfer the mini ball from one cup to the next, gradually bringing it down through the pyramid.",
                "Players must keep the balloon under control throughout the game and must not directly touch the ball with their hands.",
                "The challenge is successfully completed when the team brings the ball from the top cup to the final bottom cup without dropping the balloon.",
              ],
            },
            {
              name: "SKETCH HUNT",
              note: "",
              rules: [
                "Each team consists of 2 members, and one member will be verbally given the names of 5 objects. They will have 25 seconds to remember the objects.",
                "After listening to the objects, the player must draw them from memory without telling the objects to their teammate.",
                "The player must then show the drawings to their teammate, who has to identify the objects based on the sketches.",
                "Players are not allowed to write the name of the object, letters, numbers, or any direct clues in the drawing.",
                "Each team will have 1 minute to identify the objects correctly from the sketches, and the challenge must be completed within the given time limit.",
              ],
            },
            {
              name: "BUCKET BATTLE",
              note: "",
              rules: [
                "Each team consists of 2 members. One member will hold the bucket while the other member will throw the ball.",
                "The bucket holder must sit at the designated position, while the other player stands at the throwing point.",
                "The player must throw the ball into the bucket from the designated distance.",
                "The bucket holder must keep the bucket within the designated position and must not move towards the throwing player to catch the ball.",
                "The team must successfully land the ball inside the bucket to complete the challenge.",
              ],
            },
          ],
      },
      {
        number: null,
        name: "Round 2: THE SHOWDOWN",
        kind: null,
        rules: [],
        games: [
            {
              name: "FLIP OR FAIL",
              note: "",
              rules: [
                "Each team consists of 2 members, and 2 teams will compete against each other. One member will perform the bottle flip, while the other member will place the team's cups on the grid.",
                "The game will be played on a 3×3 grid similar to Tic-Tac-Toe, with each team using different-coloured cups.",
                "The bottle-flip player must flip the bottle and make it land upright. Only a successful flip allows their teammate to make an XO move.",
                "Teams will take turns, and after a successful bottle flip, the other team member can place one cup in any empty space on the grid. A failed bottle flip results in a lost turn.",
                "The game will be played as Best of 3 rounds. The team that wins 2 out of 3 rounds will be declared the winner.",
              ],
            },
            {
              name: "QR RUSH",
              note: "",
              rules: [
                "Each team consists of 2 members, and 2 teams will compete against each other using the same set of clues.",
                "Two common proverbs will be given as the target proverbs for both teams.",
                "The words of the proverbs will be converted into separate QR codes, and teams must scan the QR codes to collect the words.",
                "Teams must arrange the collected words in the correct order to identify the proverb.",
                "The team that correctly completes any one of the two proverbs first will be declared the winner.",
              ],
            },
            {
              name: "CHOPSTICK CHAOS",
              note: "",
              rules: [
                "Each team consists of 2 members, and two teams will compete against each other in each match.",
                "Players must collect the small chalk pieces using only the chopsticks provided to them.",
                "Players can use their hands to hold and operate the chopsticks, but they must not directly touch or pick up the chalk pieces with their hands.",
                "Each match will have a time limit of 1 minute. Players must stop collecting immediately when the time is over.",
                "The team with the highest number of chalk pieces successfully collected in their cup at the end of 1 minute will be declared the winner and qualify for the next round.",
              ],
            },
          ],
      },
      {
        number: null,
        name: "Round 3: THE FINAL STRIKE",
        kind: null,
        rules: [],
        games: [
            {
              name: "PAPER PIPELINE",
              note: "",
              rules: [
                "Each team consists of 2 members, and two teams will compete against each other in each match.",
                "Each team will be provided with one sheet for each member and 10 mini balls placed at the starting point.",
                "Players must use the sheets to transfer the balls from one member to the other, without directly touching the balls with their hands.",
                "Players must move one after another, continuously transferring the balls using the sheets and progressing towards the designated finishing point.",
                "The game will have a time limit of 2 minutes. The team that successfully transfers and collects the highest number of balls out of the 10 balls within the given time will be declared the winner and qualify for the next round.",
              ],
            },
            {
              name: "PATTERN PURSUIT",
              note: "",
              rules: [
                "This game is played with 2 players in a team and the grid will have only two colours.",
                "One colour is the colour that has to be moved, and the other is the target colour / target place which will be set by the team conducting the game.",
                "The players have to move the colour in the grid by sliding it row-wise or column-wise to bring it to the particular place set by the conducting team.",
                "Players will take turns one after another and only one move is allowed at a time until the pattern is formed.",
                "The team that successfully brings the colour to the target place first will be the winner.",
              ],
            },
          ],
      },
      {
        number: null,
        name: "FINAL GAME FOR WINNERS",
        kind: null,
        rules: [],
        games: [
            {
              name: "The Final Clash",
              note: "",
              rules: [
                "The game will be played between 2 teams, with each team standing on opposite sides at a designated distance.",
                "A cone will be placed at the centre, with the code placed near the cone. One player from each team will come forward to collect the code.",
                "Players must reach the centre, collect the code, and return to their team side without being touched by the opponent.",
                "If a player is touched by the opponent while carrying the code, the player is out and 1 point will be awarded to the opponent team. If the player successfully returns to their team side without being touched, 1 point will be awarded to their team.",
                "The game will be played as Best of 3 rounds. The team that wins 2 rounds will be declared the winner.",
              ],
            },
          ],
      },
    ],
    scoring: [],
    regulations: [
      "Teams must complete each challenge within the given time limit.",
      "All participants must follow the specific rules provided for each game.",
      "Any violation of the rules may result in disqualification.",
      "The decision of the event coordinators and judges will be final.",
    ],
    conduct: [
      "Respect event coordinators, fellow participants, and judges.",
      "Fair play is mandatory; copying, sharing answers or any unethical behaviour will lead to disqualification.",
      "Participants must follow the instructions given by the event coordinators throughout the event.",
    ],
    winning: [
      "Winners of each round will be determined according to the specific rules and criteria of the respective game.",
      "The final winner will be based on the outcome of THE FINAL CLASH.",
      "In case of any dispute, the event coordinators and judges will decide the final standing.",
    ],
    prizes: null,
    progression: null,
  },
  {
    id: "chill-flex",
    name: "Chill Flex",
    category: "Non-Technical",
    svgIcon: "film",
    tagline: "Tamil cinema, buzzers and total chaos.",
    summary: "Picture puzzles, blurred movie stills and blindfolded jigsaws — a buzzer-driven cinema quiz for teams of two to four, ending in a face-to-face betting round.",
    teamSize: "2–4 members",
    facts: [
      { label: "Rounds", value: "3" },
      { label: "Games", value: "5" },
      { label: "Team size", value: "2–4 members" },
      { label: "Decided by", value: "Rendu Perukum Nadula Tha Potiyaee" },
    ],
    generalRules: [
      "Participants will compete in teams of 2–4 members.",
      "Teams must follow the rules and instructions given for each game.",
      "Team members are allowed to discuss with one another during the respective games unless otherwise specified.",
      "Participants must complete each challenge according to the given time limits and instructions.",
      "The decision of the event coordinators and judges will be final.",
    ],
    rounds: [
      {
        number: null,
        name: "ROUND 1 – ADICHI THOOKU SAAMI",
        kind: null,
        rules: [],
        games: [
            {
              name: "Ivan Thana Athu",
              note: "Participation: 2–4 members",
              rules: [
                "The pictures of some random objects will be shown on the screen with the name of the picture in English (e.g., Ocean Fruit with pictures of that object).",
                "The team members can discuss with themselves and should find the actor/actress’s name from the given pictures.",
                "Once they find out, they should click the buzzer provided by the organizers. The team that clicks the buzzer first will be prioritized to tell the answer.",
                "If they give the right answer, they will get one point. Otherwise, the chance can be forwarded to the next team and so on.",
                "A total of 7 questions will be given to the teams. The team that gets the highest points will be the winner of this game.",
              ],
            },
            {
              name: "Pangu Put the Song Uhh",
              note: "Participation: 2–4 members",
              rules: [
                "The team members should play along with their team members.",
                "A group of pictures will be displayed on the screen, visible to all teams.",
                "Teams can discuss with their team members to find the famous Tamil cinema song from the given pictures.",
                "The pictures should connect with each other to identify the song. The team that presses the buzzer first can tell the answer.",
                "If they give the right answer, they will get points. Otherwise, the chance will be moved to the next team and so on.",
                "A total of 7 sets of song pictures will be displayed on the screen.",
                "The team with the highest points will be declared the winner of this game.",
              ],
            },
          ],
      },
      {
        number: null,
        name: "ROUND 2 – ENNA KODUMAI SARAVANAN ITHU",
        kind: null,
        rules: [],
        games: [
            {
              name: "Naa Sonna Kellu",
              note: "Participation: 2–4 members",
              rules: [
                "Team members should select one person among them who will remain blindfolded throughout this round. The blindfold can be removed once the round is finished by the organizers.",
                "The other team members should face the screen, which shows 4 random blurred images of random Tamil cinema movies.",
                "The team can discuss among themselves and should press the buzzer to identify the movie blurred in the image. The team that hits the buzzer first will be prioritized.",
                "They can tell any movie among the 4 images being shown on the screen.",
                "If a team gets the right answer, they should run to their respective table, which contains mixed puzzle pieces of the image shown on the screen.",
                "The blindfolded person should arrange the puzzle, while the other team members should instruct them to fix it. The puzzle contains 6–8 pieces.",
                "The team that fixes the puzzle first is the winner of Round 2, and their time taken will be noted by the organizers.",
                "The blurred image will be a random movie scene, and the puzzle will be the image of the actor/actress who acted in that film.",
              ],
            },
          ],
      },
      {
        number: null,
        name: "FINAL ROUND – RENDU PERUKUM NADULA THA POTIYAEE",
        kind: null,
        rules: [],
        games: [
            {
              name: "Munjiku Mela Sollu Da",
              note: "2 players per team, face-to-face format",
              rules: [
                "Each team must have 2 players. For each question, one player from each team will directly face each other.",
                "The host will ask a question, and both players must listen carefully before starting the betting process.",
                "After the question is announced, the two players must start bidding within the given time. They must predict how many answers they can correctly give within 30 seconds.",
                "The bidding starts with a number, for example, 2. The opposing player must either increase the bet (3, 4, 5, and so on) or issue a Challenge.",
                "If a player challenges the opponent's bet, the second member of the challenged team will take part in the challenge. They must answer the same question within 30 seconds and attempt to give more correct answers than the number stated in the bet.",
                "If the challenged player gives more correct answers than the bet, the challenged team wins that question. If they fail to exceed the bet, the challenging team wins the question.",
                "A total of 7 questions will be asked in this round. The players will continue facing off according to the same betting and challenge rules for each question.",
                "The team that wins the highest number of questions out of the 7 rounds will be declared the winner.",
              ],
            },
            {
              name: "Ipdi Pannitigalae Maa",
              note: "2 players per team, face-to-face format",
              rules: [
                "Each team must have 2 players. In the final round, one player from each team will face each other directly.",
                "Two tables will be placed at the centre, with movie dialogues written on separate cardboard pieces. The cards will be kept face-down, so neither the players nor the organizers know which dialogue is on each card.",
                "A board with four separate columns (1, 2, 3, and 4) will be placed at a distance from the tables. Each movie dialogue will be divided into four parts based on its words, and the players must place the parts in the correct columns.",
                "Before the game begins, one player from each team will play Rock–Paper–Scissors. The winner gets the first opportunity to make a move.",
                "The winning player must pick a face-down dialogue card from the table, take it to the board, and place it in the appropriate column. One turn allows only one move — either placing a card or rearranging/shuffling a card already placed.",
                "If a player realizes that a dialogue part has been placed in the wrong column, they cannot immediately correct it. They must first win the next Rock–Paper–Scissors round against their direct opponent. Only after winning they can make their next move and correct the placement.",
                "After every Rock–Paper–Scissors round, the two players who directly faced each other in the previous round must play again. The player who won the previous round cannot choose another teammate to play on their behalf. This ensures that the same two opponents continue the direct face-off.",
                "The game continues until all the dialogue parts are correctly placed and the complete movie dialogue is formed. The team that correctly completes and fixes its dialogue first will be declared the winner.",
              ],
            },
          ],
      },
    ],
    scoring: [],
    regulations: [
      "Teams must follow the instructions provided for each game.",
      "All games must be completed within the specified time limits.",
      "Buzzer-based answers will be given to the team that presses the buzzer first.",
      "If the first team gives an incorrect answer, the opportunity may be passed to the next team as specified in the respective game.",
      "Participants must not interfere with another team's game or equipment.",
      "Any violation of the game rules may result in disqualification.",
      "The decision of the event coordinators and judges will be final.",
    ],
    conduct: [
      "Respect event coordinators, fellow participants, and judges.",
      "Fair play is mandatory.",
      "Teams must not intentionally disrupt or interfere with other teams.",
      "Participants must follow the instructions given by the event coordinators throughout the event.",
      "Any unethical behaviour or rule violation may lead to disqualification.",
    ],
    winning: [
      "Winners of individual games will be determined according to the rules and scoring criteria of the respective game.",
      "The winners of the respective rounds will proceed according to the event structure.",
      "The final winner will be determined based on the outcome of the FINAL ROUND – RENDU PERUKUM NADULA THA POTIYAEE.",
      "In case of any dispute, the event coordinators and judges will decide the final standing.",
    ],
    prizes: null,
    progression: null,
  },
];

// Prizes for the non-technical events are not yet announced.
const PRIZE_NOTE = "Prizes for the non-technical events will be announced soon.";

const FAQ = [
  {
    q: "Which events is the CSE department running?",
    a: "Three: <strong>Stack and Level</strong> (technical), plus <strong>The Reckoning</strong> and <strong>Chill Flex</strong> (non-technical). Every rule for all three is on this page.",
  },
  {
    q: "How do I register?",
    a: "<strong>Registration is spot registration only, at the venue.</strong> You can also pre-register through the Technofest-3.0 form so we know you are coming.",
  },
  {
    q: "How many people can be in a team?",
    a: "It depends on the event: <strong>Stack and Level</strong> is teams of 1 to 4 members, <strong>The Reckoning</strong> is teams of 2 members, and <strong>Chill Flex</strong> is teams of 2–4 members.",
  },
  {
    q: "Do I need to bring a laptop?",
    a: "Only for Stack and Level, and even there a laptop is optional — teams may use the lab computer provided, and <strong>each team competes on one device only</strong>.",
  },
  {
    q: "Can I use my phone during Stack and Level?",
    a: "No. <strong>Mobile phones are strictly prohibited as a second device in every level.</strong> Phones are used in Chill Flex only where a game requires scanning, as instructed by the coordinators.",
  },
  {
    q: "Are AI tools and the internet allowed?",
    a: "Only in <strong>Sight Unseen</strong>, where AI tools and internet access are allowed. There is <strong>no internet, AI tools or outside help in Bug Bounty and Buzz or Bust</strong>.",
  },
  {
    q: "How do teams qualify in Stack and Level?",
    a: "The <strong>top 5 teams from each lab</strong> qualify from Bug Bounty, and a team must solve at least one question to qualify at all. The <strong>top 5 teams</strong> then advance from Sight Unseen to the final level.",
  },
  {
    q: "What happens if my device disconnects?",
    a: "Keep your <strong>Team ID</strong> safe — it is needed to rejoin if your device disconnects.",
  },
  {
    q: "What are the prizes?",
    a: "For <strong>Stack and Level</strong>: first prize <strong>₹1,500</strong>, second <strong>₹1,000</strong> and third <strong>₹750</strong>, each with a certificate. Prizes for the non-technical events will be announced soon.",
  },
  {
    q: "How are the winners decided?",
    a: "Stack and Level goes to the <strong>top three teams with the highest cumulative scores in Buzz or Bust</strong>. The Reckoning is decided by <strong>The Final Clash</strong>, and Chill Flex by the <strong>final round</strong>. In case of a tie or dispute, the event coordinators and judges decide the final standing.",
  },
];

if (typeof module !== "undefined") {
  module.exports = { EVENTS, PRIZE_NOTE, FAQ };
}
