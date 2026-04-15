import { test, chromium, type Page } from '@playwright/test';
import path from 'path';

type UploadDirectories = {
  randomUploadDir: string;
  visinemaUploadDir: string;
};

type ScenarioSetup =
  | { kind: 'none' }
  | {
      kind: 'upload';
      files: (directories: UploadDirectories) => string | string[];
      shouldClickCheckedButton?: boolean;
    }
  | { kind: 'popover-and-toggle' };

type ScenarioDefinition = {
  number: number;
  prompt: string;
  setup?: ScenarioSetup;
};

const SCENARIO_TIMEOUT = 5 * 60 * 1000;
const TOTAL_ITERATIONS = 5;
const ITERATION_START = Number(process.env.PW_ITERATION_START ?? '1');
const ITERATION_END = Number(process.env.PW_ITERATION_END ?? String(TOTAL_ITERATIONS));
const ITERATION_COUNT = ITERATION_END - ITERATION_START + 1;
const IS_HEADLESS = process.env.PW_HEADLESS !== 'false';

const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  {
    number: 1,
    setup: {
      kind: 'upload',
      files: directories => path.resolve(directories.randomUploadDir, 'MS Glow Men.xlsx'),
    },
    prompt: `Help me analyzing the competitive landscape for "MS Glow for Men" within the growing Indonesian men's skincare market. The brand currently positions itself with a message of inclusivity and practicality ("Semua Juga Bisa"). The market is saturated with options from both local and international brands, yet market penetration among the mass male demographic remains lower than the female demographic. As your research goal please identify the primary friction points (pain points) that prevent potential male consumers from adopting or staying loyal to MS glow for men. Spesifically, I want to understand if the barrier to entry is structural (price, availability, lack of product variety) or cognitive (knowledge gaps, safety concerns, confusion in selection).`,
  },
  {
    number: 2,
    setup: {
      kind: 'upload',
      files: directories => [
        path.resolve(directories.randomUploadDir, 'hampers 1.jpg'),
        path.resolve(directories.randomUploadDir, 'hampers 2.jpg'),
      ],
    },
    prompt: `Indonesia hampers market (urban tier 1-2 cities), 2024-2026. Focus on small-to-mid-scale packaging business targeting seasonal demand (Lebaran, Christmas, Chinese New Year, corporate gifting). Identify the most viable product category to start a hampers-focused business with high margin, repeat seasonal demand, manageable operational complexity, and scalable packaging differentiation. Key Questions: 1. Which product category shows the strongest combination of: - High perceived value - Low spoilage risk - Strong gifting suitability - Healthy gross margin potential (>40%) 2. What consumer motivations drive hampers purchase decisions? (Prestige, practicality, aesthetic appeal, brand signaling, cultural meaning, etc.) 3. Which product categories are overcrowded (e.g., cookies, cakes)? 4. Where are white-space opportunities in premium-but-accessible hampers? 5. Which categories allow strongest packaging differentiation advantage? 6. What price bands dominate successful hampers? 7. What operational risks exist (supply chain, perishability, seasonality)?`,
  },
  {
    number: 3,
    setup: { kind: 'popover-and-toggle' },
    prompt: `Context & Objective:
Help me analyze the content format and audience retention for the children's educational entertainment program "DOMIKADO" (Project Lavender). The goal is to understand how well the target audience (children and their parents) receives the educational content, dialogue, and episode formatting.
As my research goal, please identify the cognitive acceptance (understanding of dialogue/educational value) and structural acceptance (episode duration), and how these factors contribute to the audience's desire to re-watch the program.

Data Instructions:
Please extract insights and cross-reference the data using the following specific survey questions from the Project Lavender dataset:

Content Hook & Comprehension:
Analyze C16: mohon ranking dari urutan pertama sampai terakhir yang menurut Anda paling menarik/disukai dari program hiburan edukatif anak DOMIKADO.
Analyze C17 & C18: penilaian Anda terhadap dialog... and seberapa mudah dimengerti kah... (Use this to assess cognitive barriers).
Structural Format:
Analyze C19: Menurut Anda, apakah durasi per episode dari program hiburan edukatif anak DOMIKADO sudah sesuai?

Retention & Churn:
Analyze C20, C21a, & C21b: seberapa ingin kah... untuk menonton kembali and the reasons for wanting/not wanting to re-watch.
Synthesize these findings to provide strategic recommendations on what content elements Visinema should maintain and what structural or dialogue changes are needed to boost re-watchability.`,
  },
  {
    number: 4,
    setup: { kind: 'popover-and-toggle' },
    prompt: `Context & Objective:
Help me analyze character preference and parent-targeted marketing strategies for the children's program "DOMIKADO". For a children's IP to succeed, we need to appeal to the children (end-users) through characters, while simultaneously winning over the parents (decision-makers) through the right marketing channels.
As my research goal, please identify which characters are the strongest assets for the IP, and map out the best digital touchpoints (parenting forums/communities) to acquire new parent audiences.

Data Instructions:
Please extract insights using the following specific survey questions from the Project Domikado dataset:

Child Lifestyle Context:

Analyze S14A & S14B: Manakah dari kegiatan berikut yang biasanya dilakukan oleh Anak Anda PADA HARI SEKOLAH / PADA HARI LIBUR? (To map the child's daily media consumption window).

IP Asset Strength (Characters):

Analyze P12: Menurut Anda karakter atau konten Apa yang disukai oleh anak? Mohon berikan ranking dari yang paling disukai... (Identify the "hero" characters of the show).

Parenting Acquisition Channels:

Analyze Q1 & Q2: Dimanakah biasanya Anda mencari informasi / berinteraksi terkait hal parenting? >    - Analyze Q3.1, Q3.2, Q3.3, Q3.4: (Extract the specific names of Online Forums, Blogs, and Offline/Online Parenting Communities they actively follow).

Conclude with an actionable marketing roadmap for Visinema on which characters to feature on marketing collaterals and which specific parenting communities/forums should be targeted for partnerships.`,
  },
  {
    number: 5,
    setup: { kind: 'popover-and-toggle' },
    prompt: `Context & Objective:
Help me analyze the marketing asset effectiveness (A/B testing for Posters and Trailer engagement) for the upcoming movie release "Project Sevilla". The objective is to determine which promotional materials best drive purchase intent (desire to go to the cinema).
As my research goal, please evaluate the visual appeal and genre alignment of Poster A vs. Poster B, and assess whether the Trailer successfully converts viewers into potential ticket buyers. Identify the key scenes or elements that drive this conversion.

Data Instructions:
Please extract insights and cross-reference the data using the following specific survey questions from the Project Sevilla dataset:

Poster A/B Testing (Visual & Hook):

Analyze C1.1, C2.1, C3.1: Overall liking, attractiveness, and movie taste suitability for POSTER A.

Compare with C1.2, C2.2, C3.2 (for POSTER B) to determine the winning visual key art.

Trailer Effectiveness & Purchase Intent:

Analyze C18: After watching the trailer, how likely do you want to watch the film? (Measure direct conversion/intent).

Analyze C19a & C19b: What is your reason for wanting / not wanting to watch the film?

Analyze C21 & C22: Which scene attracted you the most? and What kind of genre do you feel? (To see if the trailer communicated the intended genre correctly).

Cinema Habits & Influencers:

Analyze A6 & A9: How often did you go to cinema... and Which source of information influenced you the most to watch Indonesian film in Cinema?

Provide a recommendation on which Poster should be used as the primary key art, and what elements from the trailer should be amplified in social media ads to maximize opening week ticket sales.`,
  },
  {
    number: 6,
    prompt: `I want to understand how to sell bakwan effectively in this digital era`,
  },
  {
    number: 7,
    setup: {
      kind: 'upload',
      files: directories => [
        path.resolve(directories.visinemaUploadDir, 'visinema1.jpg'),
        path.resolve(directories.visinemaUploadDir, 'visinema2.jpg'),
      ],
      shouldClickCheckedButton: false,
    },
    prompt: `Indonesian film and entertainment industry (Visinema Group & Visinema Pictures brand identity), visual evolution analysis. Focus on the transition from a detailed, illustrative mascot logo to a modern, minimalist silhouette design. Evaluate the effectiveness of this logo evolution in modernizing the brand, enhancing versatility across digital and cinematic mediums, and maintaining core brand recognition.

Key Questions:

Which elements of the new silhouette logo show the strongest combination of:

Brand recognition retention (the dog mascot)

Scalability across digital, print, and cinematic screens

Modern corporate aesthetic appeal

Versatility for sub-brand expansion (e.g., Group, Pictures, Kids, Music)

What audience perceptions and emotions are driven by using a dog mascot in a film production context? (Approachability, loyalty, storytelling charm, independent spirit, etc.)

What visual cliches are currently overcrowded in the Indonesian film production industry logos (e.g., film reels, clapperboards, cinematic lenses)?

Where are the white-space opportunities for Visinema's unique, mascot-driven brand identity to stand out further among other local studios?

Which aspects of the new minimalist logo allow for the strongest animation and motion graphic advantages (e.g., opening cinematic bumpers before a movie)?

What brand positioning (e.g., indie-creative vs. mainstream entertainment powerhouse) is signaled by this shift to a cleaner, corporate-yet-playful identity?

What branding risks existed during this design transition (e.g., loss of original charm, over-simplification, disconnect from early audiences)?`,
  },
  {
    number: 8,
    setup: {
      kind: 'upload',
      files: directories => path.resolve(directories.visinemaUploadDir, 'Editing visinema.pdf'),
      shouldClickCheckedButton: false,
    },
    prompt: `I want to know how effective all method about editing in that pdf journal can improve rating visinema in this AI era`,
  },
  {
    number: 9,
    prompt: `Context & Objective:
Help me analyze the content format and audience retention for the children's educational entertainment program "DOMIKADO" (Project Lavender). The goal is to understand how well the target audience (children and their parents) receives the educational content, dialogue, and episode formatting.
As my research goal, please identify the cognitive acceptance (understanding of dialogue/educational value) and structural acceptance (episode duration), and how these factors contribute to the audience's desire to re-watch the program.

Data Instructions:
Please extract insights and cross-reference the data using the following specific survey questions from the Project Lavender dataset:

Content Hook & Comprehension:
Analyze C16: mohon ranking dari urutan pertama sampai terakhir yang menurut Anda paling menarik/disukai dari program hiburan edukatif anak DOMIKADO.
Analyze C17 & C18: penilaian Anda terhadap dialog... and seberapa mudah dimengerti kah... (Use this to assess cognitive barriers).
Structural Format:
Analyze C19: Menurut Anda, apakah durasi per episode dari program hiburan edukatif anak DOMIKADO sudah sesuai?

Retention & Churn:
Analyze C20, C21a, & C21b: seberapa ingin kah... untuk menonton kembali and the reasons for wanting/not wanting to re-watch.
Synthesize these findings to provide strategic recommendations on what content elements Visinema should maintain and what structural or dialogue changes are needed to boost re-watchability.`,
  },
  {
    number: 10,
    prompt: `Context & Objective:
Help me analyze character preference and parent-targeted marketing strategies for the children's program "DOMIKADO". For a children's IP to succeed, we need to appeal to the children (end-users) through characters, while simultaneously winning over the parents (decision-makers) through the right marketing channels.
As my research goal, please identify which characters are the strongest assets for the IP, and map out the best digital touchpoints (parenting forums/communities) to acquire new parent audiences.

Data Instructions:
Please extract insights using the following specific survey questions from the Project Domikado dataset:

Child Lifestyle Context:

Analyze S14A & S14B: Manakah dari kegiatan berikut yang biasanya dilakukan oleh Anak Anda PADA HARI SEKOLAH / PADA HARI LIBUR? (To map the child's daily media consumption window).

IP Asset Strength (Characters):

Analyze P12: Menurut Anda karakter atau konten Apa yang disukai oleh anak? Mohon berikan ranking dari yang paling disukai... (Identify the "hero" characters of the show).

Parenting Acquisition Channels:

Analyze Q1 & Q2: Dimanakah biasanya Anda mencari informasi / berinteraksi terkait hal parenting? >    - Analyze Q3.1, Q3.2, Q3.3, Q3.4: (Extract the specific names of Online Forums, Blogs, and Offline/Online Parenting Communities they actively follow).

Conclude with an actionable marketing roadmap for Visinema on which characters to feature on marketing collaterals and which specific parenting communities/forums should be targeted for partnerships.`,
  },
  {
    number: 11,
    prompt: `Context & Objective:
Help me analyze the marketing asset effectiveness (A/B testing for Posters and Trailer engagement) for the upcoming movie release "Project Sevilla". The objective is to determine which promotional materials best drive purchase intent (desire to go to the cinema).
As my research goal, please evaluate the visual appeal and genre alignment of Poster A vs. Poster B, and assess whether the Trailer successfully converts viewers into potential ticket buyers. Identify the key scenes or elements that drive this conversion.

Data Instructions:
Please extract insights and cross-reference the data using the following specific survey questions from the Project Sevilla dataset:

Poster A/B Testing (Visual & Hook):

Analyze C1.1, C2.1, C3.1: Overall liking, attractiveness, and movie taste suitability for POSTER A.

Compare with C1.2, C2.2, C3.2 (for POSTER B) to determine the winning visual key art.

Trailer Effectiveness & Purchase Intent:

Analyze C18: After watching the trailer, how likely do you want to watch the film? (Measure direct conversion/intent).

Analyze C19a & C19b: What is your reason for wanting / not wanting to watch the film?

Analyze C21 & C22: Which scene attracted you the most? and What kind of genre do you feel? (To see if the trailer communicated the intended genre correctly).

Cinema Habits & Influencers:

Analyze A6 & A9: How often did you go to cinema... and Which source of information influenced you the most to watch Indonesian film in Cinema?

Provide a recommendation on which Poster should be used as the primary key art, and what elements from the trailer should be amplified in social media ads to maximize opening week ticket sales.`,
  },
  {
    number: 12,
    prompt: `You are a Head of Audience Growth at Visinema responsible for evaluating the performance of DOMIKADO after its first 20+ episodes. Your goal is to maximize the NPS (Net Promoter Score) and convert "Occasional Viewers" into "Heavy Users". Analyze the provided evaluation data and deliver:Behavioral Reality (Not Assumptions)
* Real usage of YouTube vs. YouTube Kids accounts and the specific reasons for parental supervision levels.
* Access duration habits (e.g., why 30 mins - 3 hours is the sweet spot) and the role of smartphones as the primary device.Switching Triggers & Rejection Factors
* Analyze the specific obstacles: "Content not suitable for development" vs. "Subscription fees".
* Identify why older kids (6-8 years old) are dropping the show faster than younger ones.Core Weaknesses of the Current Product
* The gap between "Visual Liking" and "Music Diversity" scores.
* Why Domikado's NPS is 2nd to Nussa and what prevents it from being 1st.User Archetypes
* Segment the audience by "Engagement Style" (The "Relaxed Weekend Mom" vs. "Strict Semarang Supervised Parent").
* Define their media influence sources (Live IG vs. KOL Celebrities like Raffi/Nagita).Strategic Levers to Increase NPS & BUMO
* Content Improvement: Mechanics of "Game Tutorials" and adding "Indonesian Culture" content as demanded by existing viewers.
* Language Policy: Addressing the 83% preference for Indonesian while capturing the niche 16% "Doesn't Matter" group.Execution Priorities
* Quick wins (0â€“3 months): Addressing duration/topic dissatisfaction and optimizing YouTube ad placement based on WOM influencers.
* Mid-term (3â€“6 months): Implementing "Tutorial-Story-Culture" hybrid episodes.
* Structural bets (6â€“12 months): Deep-dive Qualitative study on "Dialogue levels" to fix the boredom/conversation ratio.`,
  },
  {
    number: 13,
    prompt: `You are a Chief Content Officer at Visinema responsible for increasing viewership frequency and BUMO (Brand Used Most Often) for DOMIKADO among parents who consume multi-platform children's content (YouTube, National TV, and Streaming Platforms like Netflix/Disney+). Your goal is to identify how Domikado can capture a greater share of children's daily viewing time. Analyze the provided research data and deliver:Behavioral Reality (Not Assumptions)
* How parents and children (3-8 years old) actually behave across weekdays vs. weekends.
* When and why they choose local content (Domikado, Upin Ipin) vs. international giants (Coco Melon) in real scenarios.Switching Triggers & Rejection Factors
* What specific signals cause parents to drop Domikado (e.g., "too much conversation", "lack of music diversity", annoying ads).
* Rank these triggers by impact on "One-time-only" viewers vs. "Heavy users".Core Weaknesses of Domikado
* Where Domikado is currently losing frequency in the funnel (Awareness vs. Most Watched) compared to market leaders like Upin & Ipin.
* Focus on the "Uniqueness Gap" and why its satisfaction score lags despite high concept liking.User Archetypes
* Cluster parents into 3â€“5 segments based on demographic data (e.g., Upper SEC Jakarta Moms who participate in interactive activities vs. Makassar Moms who monitor remotely).
* Define each by their specific "Push Factors" (Scientific content vs. Sensory growth focus).Strategic Levers to Increase Viewing Frequency & BUMO
* How to increase habit formation (e.g., moving beyond "Episode 1: Belajar Tangga Nada" preference).
* Specific content bundles: Combining "Storytelling" with "Game Tutorials" and "Indonesian Culture" to create a complete package.
* Channel strategy: Optimizing YouTube recommendations vs. Offline events.Execution Priorities
* Quick wins (0â€“3 months): Ad optimization and addressing the "too much dialogue" feedback for early episodes.
* Mid-term (3â€“6 months): Developing Indonesian Culture segments and integrating high-recalled characters like Astrobek or Cis-Cis more effectively.
* Structural bets (6â€“12 months): Ecosystem lock-in through school events and parenting community integration (WAGs/The Asian Parent).`,
  },
  {
    number: 14,
    prompt: `You are a Marketing Strategy Lead at Visinema responsible for the theatrical release of the film ALI TOPAN. Your goal is to maximize "Intention to Watch" by optimizing promotional assets based on Indonesian moviegoer behavior. Analyze the provided evaluation data and deliver:Behavioral Reality (Not Assumptions)
* Cinema visit frequency (once every 2-3 months) and the dominance of Cinema 21/XXI.
* How awareness is actually built: "Ads in cinema before a movie" vs. "Social Media".Asset Performance & Rejection Factors
* Compare Poster 1 vs. Poster 2: Why the "challenging/cool background" beats the "motorbike/simple" design in Jakarta.
* Psychological impact: Identify why Poster 2 causes "uncertainty" while Teasers/Trailers trigger "tension and amusement".Core Funnel Gaps
* Identify the drop-off point between "Overall Liking" of assets and "Definitely Will Watch" conversion (Focus on the 31% 'Not Know Yet' group for Poster 1).User Archetypes
* Segment by genre preference: The "Horror-Comedy Seekers" vs. "Action-Adventure Younger Groups".
* Cluster by platform usage: TikTok-Heavy Females vs. Instagram/YouTube Males.Strategic Levers to Increase BUMO (Visinema as Top of Mind)
* Social Media Timing: Leveraging the 3 PM to Midnight window for peak engagement.
* Scene Optimization: Highlighting "Fighting scenes" and "Motorbike Action" for students while pushing "Family-Romance" for older segments.
* Influencer Strategy: Utilizing "Kona" or "Jefri Nichol" as top-recalled accounts.Execution Priorities
* Quick wins (0â€“3 months): Using Poster 1 as the primary asset across Bodetabek and pushing the Action-heavy Teaser on TikTok.
* Mid-term (3â€“6 months): Creating targeted ads for "Cinema 21" pre-screenings and leveraging WOM (Word of Mouth) recommendations.
* Structural bets (6â€“12 months): Ecosystem integration with social media influencers to drive ticket sales before the 2nd-month theatrical drop-off.`,
  },
  {
    number: 15,
    prompt: `What if visinema using Artificial Intelligence to all process film production can decrease their cost production?`,
  },
];

const LAST_SCENARIO_NUMBER = SCENARIO_DEFINITIONS.length;
const TOTAL_TEST_TIMEOUT =
  SCENARIO_TIMEOUT * LAST_SCENARIO_NUMBER * ITERATION_COUNT + 10 * 60 * 1000;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi.`);
  }

  return value;
}

function validateIterationRange() {
  if (
    !Number.isInteger(ITERATION_START) ||
    !Number.isInteger(ITERATION_END) ||
    ITERATION_START < 1 ||
    ITERATION_END > TOTAL_ITERATIONS ||
    ITERATION_START > ITERATION_END
  ) {
    throw new Error(
      `Range iterasi tidak valid. PW_ITERATION_START=${ITERATION_START}, PW_ITERATION_END=${ITERATION_END}.`,
    );
  }
}

async function clickNewResearch(page: Page) {
  const newResearch = page.getByText('New Research', { exact: true });
  await newResearch.waitFor({ state: 'visible' });
  await newResearch.click();
}

async function openPopoverAndEnableToggle(page: Page) {
  await page.locator(`//button[@data-slot='popover-trigger' and @data-size='sm']`).click();
  await page.waitForTimeout(2000);
  await page.locator(`//button[@data-state='checked']`).click();
  await page.waitForTimeout(2000);
}

async function uploadFiles(
  page: Page,
  files: string | string[],
  shouldClickCheckedButton = true,
) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    (async () => {
      await page.locator(`//button[@data-slot='popover-trigger' and @data-size='sm']`).click();
      await page.waitForTimeout(2000);

      if (shouldClickCheckedButton) {
        await page.locator(`//button[@data-state='checked']`).click();
        await page.waitForTimeout(2000);
      }

      await page.getByText('Upload Files', { exact: true }).click();
      await page.waitForTimeout(2000);
    })(),
  ]);

  await fileChooser.setFiles(files);
}

async function submitResearchAndProceed(page: Page, promptText: string) {
  const chatInput = page.locator('#chat-input');
  const sendResearch = page.locator(`[data-testid='send-button']`);
  const openStream = page.getByText(/Here is/i);
  const confirmState = page.getByText(/proceed/i);

  const openStreamCount = await openStream.count();

  await chatInput.waitFor({ state: 'visible' });
  await chatInput.fill(promptText);

  await page.waitForTimeout(5000);

  await sendResearch.waitFor({ state: 'visible' });
  await sendResearch.click();

  await openStream.nth(openStreamCount).waitFor({ state: 'visible' });

  const confirmStateCount = await confirmState.count();

  await chatInput.waitFor({ state: 'visible' });
  await chatInput.fill('Proceed');

  await sendResearch.waitFor({ state: 'visible' });
  await sendResearch.click();

  await confirmState.nth(confirmStateCount).waitFor({ state: 'visible' });
}

async function loginToAsklumia(page: Page, email: string, password: string) {
  await page.goto('https://dev.asklumia.ai/auth/get-started', { waitUntil: 'networkidle' });

  const emailBox = page.getByRole('textbox', { name: 'Enter Your Email' });
  await emailBox.waitFor({ state: 'visible' });
  await emailBox.fill(email);

  await page.getByRole('button', { name: 'Continue' }).nth(2).click();

  const passwordBox = page.getByRole('textbox', { name: 'Input password' });
  await passwordBox.waitFor({ state: 'visible' });
  await passwordBox.fill(password);

  await page.getByRole('button', { name: 'Continue' }).click();
}

function getScenarioTitle(iteration: number, scenarioNumber: number) {
  return `ITERATION ${iteration} - SCENARIO ${scenarioNumber}`;
}

function getNextScenarioTitle(iteration: number, scenarioNumber: number) {
  if (scenarioNumber < LAST_SCENARIO_NUMBER) {
    return getScenarioTitle(iteration, scenarioNumber + 1);
  }

  if (iteration < ITERATION_END) {
    return getScenarioTitle(iteration + 1, 1);
  }

  return null;
}

async function runScenario<T>(
  iteration: number,
  scenarioNumber: number,
  body: () => Promise<T>,
) {
  const title = getScenarioTitle(iteration, scenarioNumber);
  const startedAt = Date.now();
  const result = await test.step(title, body, { timeout: SCENARIO_TIMEOUT });
  const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
  const nextScenarioTitle = getNextScenarioTitle(iteration, scenarioNumber);
  const message = nextScenarioTitle
    ? `${title} selesai dalam ${durationSeconds} detik. Lanjut ke ${nextScenarioTitle}.`
    : `${title} selesai dalam ${durationSeconds} detik.`;

  console.log(message);
  test.info().annotations.push({
    type: 'scenario-duration',
    description: message,
  });

  return result;
}

async function prepareScenario(
  page: Page,
  directories: UploadDirectories,
  scenario: ScenarioDefinition,
) {
  await clickNewResearch(page);

  const setup = scenario.setup ?? { kind: 'none' as const };

  if (setup.kind === 'upload') {
    await uploadFiles(
      page,
      setup.files(directories),
      setup.shouldClickCheckedButton ?? true,
    );
    return;
  }

  if (setup.kind === 'popover-and-toggle') {
    await openPopoverAndEnableToggle(page);
  }
}

async function executeScenario(
  page: Page,
  directories: UploadDirectories,
  iteration: number,
  scenario: ScenarioDefinition,
) {
  await runScenario(iteration, scenario.number, async () => {
    await prepareScenario(page, directories, scenario);
    await submitResearchAndProceed(page, scenario.prompt);
  });
}

test('Access asklumia Scenario 1', async () => {
  validateIterationRange();
  test.setTimeout(TOTAL_TEST_TIMEOUT);

  const projectRoot = process.cwd();
  const uploadDirectories: UploadDirectories = {
    randomUploadDir: path.resolve(projectRoot, 'file upload', 'Random'),
    visinemaUploadDir: path.resolve(projectRoot, 'file upload', 'Visinema'),
  };
  const userDataDir = path.resolve(projectRoot, 'user_data_asklumia');
  const asklumiaEmail = getRequiredEnv('ASKLUMIA_EMAIL');
  const asklumiaPassword = getRequiredEnv('ASKLUMIA_PASSWORD');

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: IS_HEADLESS,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  try {
    await loginToAsklumia(page, asklumiaEmail, asklumiaPassword);

    for (let iteration = ITERATION_START; iteration <= ITERATION_END; iteration++) {
      console.log(`Memulai ITERATION ${iteration} dari ${TOTAL_ITERATIONS}.`);

      for (const scenario of SCENARIO_DEFINITIONS) {
        await executeScenario(page, uploadDirectories, iteration, scenario);
      }
    }

    await page.waitForTimeout(3000);
  } finally {
    await context.close();
  }
});
