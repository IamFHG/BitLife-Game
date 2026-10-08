import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Fallback Generators for Quota Limits or Offline mode
function generateFallbackScenario(character: any, recentLog?: string) {
  const age = character?.age || 18;
  const name = character?.firstName || 'You';

  if (age < 12) {
    return {
      title: "Playground Challenge",
      description: "A classmate dares you to eat a shiny green beetle on the playground for $5.",
      category: "random",
      options: [
        {
          text: "Eat the beetle without hesitation!",
          resultText: "You swallowed the beetle! Your stomach rumbled, but you earned $5 and playground fame.",
          statChanges: { happiness: 15, health: -5 },
          moneyChange: 5
        },
        {
          text: "Decline and report them to the supervisor.",
          resultText: "The supervisor praised your good judgment. Your smarts increased.",
          statChanges: { smarts: 5, happiness: -5 },
          moneyChange: 0
        },
        {
          text: "Dare them to eat it instead.",
          resultText: "They chickened out and the other kids laughed!",
          statChanges: { happiness: 10, karma: 5 },
          moneyChange: 0
        }
      ]
    };
  } else if (age < 18) {
    return {
      title: "School Gossip & Opportunity",
      description: "Someone started a rumor about you at school during the lunch break.",
      category: "random",
      options: [
        {
          text: "Confront them directly in the hallway.",
          resultText: "An intense verbal duel broke out! Everyone cheered your boldness.",
          statChanges: { happiness: 10, health: -5 },
          moneyChange: 0
        },
        {
          text: "Ignore the rumor and focus on your studies.",
          resultText: "The rumor faded away in a few days and you aced your next exam!",
          statChanges: { smarts: 10, happiness: 5 },
          moneyChange: 0
        },
        {
          text: "Start a hilarious rumors about yourself to confuse them.",
          resultText: "The plot twist confused everyone and you became a viral school legend!",
          statChanges: { happiness: 20, looks: 5 },
          moneyChange: 0
        }
      ]
    };
  } else if (age < 60) {
    return {
      title: "Spontaneous Opportunity",
      description: `While out in town, an energetic local entrepreneur approaches ${name} with an unusual pitch.`,
      category: "random",
      options: [
        {
          text: "Invest $100 into their startup idea.",
          resultText: "It turned out surprisingly profitable! You earned a sweet return.",
          statChanges: { happiness: 15, smarts: 5 },
          moneyChange: 350
        },
        {
          text: "Politely decline and keep walking.",
          resultText: "You played it safe and kept your money in the bank.",
          statChanges: { happiness: 0, smarts: 5 },
          moneyChange: 0
        },
        {
          text: "Offer consulting advice for a quick fee.",
          resultText: "You negotiated a quick consulting fee for an hour of your time!",
          statChanges: { happiness: 10, smarts: 10 },
          moneyChange: 150
        }
      ]
    };
  } else {
    return {
      title: "Senior Discovery",
      description: "You found an old wooden box while tidying up your home.",
      category: "random",
      options: [
        {
          text: "Open it carefully.",
          resultText: "Inside were old collectable coins worth some cash and heartwarming vintage memories!",
          statChanges: { happiness: 20, health: 5 },
          moneyChange: 300
        },
        {
          text: "Donate it to the historical society.",
          resultText: "The curator presented you with an honorary plaque!",
          statChanges: { happiness: 25, karma: 20 },
          moneyChange: 0
        },
        {
          text: "Sell it at a garage sale.",
          resultText: "A collector bought it right away!",
          statChanges: { happiness: 10 },
          moneyChange: 120
        }
      ]
    };
  }
}

function generateFallbackCustomResult(character: any, promptInput: string) {
  const promptLower = promptInput.toLowerCase();
  
  let resultText = `You attempted: "${promptInput}". After a wild turn of events, you succeeded!`;
  let moneyChange = 0;
  let statChanges: any = { happiness: 10 };
  let jailYears = 0;

  if (promptLower.includes('steal') || promptLower.includes('rob') || promptLower.includes('crime') || promptLower.includes('break in')) {
    if (Math.random() > 0.5) {
      resultText = `You attempted: "${promptInput}". You got caught red-handed by the authorities!`;
      jailYears = Math.floor(Math.random() * 2) + 1;
      statChanges = { happiness: -20, karma: -15 };
    } else {
      resultText = `You stealthily carried out: "${promptInput}" and managed to escape with cash!`;
      moneyChange = Math.floor(Math.random() * 400) + 100;
      statChanges = { happiness: 15, karma: -10 };
    }
  } else if (promptLower.includes('contest') || promptLower.includes('win') || promptLower.includes('gamble') || promptLower.includes('chili') || promptLower.includes('fight') || promptLower.includes('wrestle')) {
    resultText = `You entered the challenge: "${promptInput}". You gave it your all and won a prize!`;
    moneyChange = Math.floor(Math.random() * 250) + 50;
    statChanges = { happiness: 15, health: -5, looks: 5 };
  } else if (promptLower.includes('tiktok') || promptLower.includes('viral') || promptLower.includes('youtube') || promptLower.includes('famous')) {
    resultText = `You tried: "${promptInput}". Your video gained thousands of views overnight!`;
    moneyChange = Math.floor(Math.random() * 300) + 50;
    statChanges = { happiness: 20, looks: 10 };
  }

  return {
    resultText,
    statChanges,
    moneyChange,
    jailYears
  };
}

// Circuit breaker for quota limits (e.g. 429 RESOURCE_EXHAUSTED)
let quotaCooldownUntil = 0;

// AI Generated Dynamic Life Event Scenario
app.post("/api/ai/scenario", async (req, res) => {
  const { character, recentLog } = req.body;

  // If in quota cooldown, use fallback generator directly
  if (Date.now() < quotaCooldownUntil) {
    const fallbackEvent = generateFallbackScenario(character, recentLog);
    return res.json({ success: true, event: fallbackEvent, isFallback: true });
  }

  try {
    const ai = getGeminiClient();

    const hasJob = !!(character.currentJob && character.currentJob.title !== 'Unemployed');
    const jobCategory = character.currentJob?.category || 'None';
    const jobTitle = hasJob ? `${character.currentJob.title} (${jobCategory}) at ${character.currentJob.company}` : 'Unemployed';
    const isEnrolled = character.education?.details?.level && character.education.details.level !== 'None';
    const eduLevel = isEnrolled ? character.education.details.level : 'Not currently in school';

    const prompt = `You are the master narrator of a BitLife-style text life simulator game.
Current Character Info:
- Name: ${character.firstName} ${character.lastName}
- Age: ${character.age}
- Gender: ${character.gender}
- Job Status: ${jobTitle}
- Job Category: ${jobCategory}
- Education Status: ${eduLevel}
- Bank Balance: $${character.bankBalance}
- Country: ${character.country}
- Special Talent: ${character.specialTalent}
- Recent Life Event: ${recentLog || 'None'}

Generate a creative, humorous, dramatic, or surprising life decision event suitable for their age (${character.age}).
CRITICAL RULES:
1. If Job Status is Unemployed, DO NOT generate workplace, corporate, office, company, boss, coworker, or supplier bribe scenarios.
2. If Job Category is Military / Armed Forces / Police / Special Forces, generate military tactical, base command, patrol, or military duty scenarios ONLY. DO NOT generate corporate, company procurement, office cubicle, or corporate supplier bribe scenarios.
3. If Job Category is Medical/Healthcare, generate hospital, patient, surgery, ER, or clinical scenarios ONLY.
4. If Job Category is Legal, generate courtroom, client, trial, or judicial scenarios ONLY.
5. If character is Provisional Military Governor / State Regime Leader, generate state governance, martial law decree, military council, or national crisis scenarios ONLY.
6. If Education Status is Not currently in school, DO NOT generate school classroom or exam scenarios.
7. The event must accurately reflect their actual career and situation.

Respond strictly in JSON format with this exact schema:
{
  "title": "Short Catchy Event Title",
  "description": "1-2 sentences setting up the scenario.",
  "category": "random",
  "options": [
    {
      "text": "Option 1 choice text",
      "resultText": "Consequence narrative text",
      "statChanges": { "happiness": 10, "health": -5 },
      "moneyChange": 100
    },
    {
      "text": "Option 2 choice text",
      "resultText": "Consequence narrative text",
      "statChanges": { "smarts": 5, "karma": 10 },
      "moneyChange": 0
    },
    {
      "text": "Option 3 choice text",
      "resultText": "Consequence narrative text",
      "statChanges": { "happiness": -10 },
      "moneyChange": -50
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
      }
    });

    const jsonText = response.text || "{}";
    const eventData = JSON.parse(jsonText);
    res.json({ success: true, event: eventData });
  } catch (error: any) {
    const errStr = String(error?.message || error);
    if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED')) {
      quotaCooldownUntil = Date.now() + 60000; // 60 seconds cooldown
    }
    const fallbackEvent = generateFallbackScenario(character, recentLog);
    res.json({ success: true, event: fallbackEvent, isFallback: true });
  }
});

// AI Custom User Prompted Action ("What if I try to...")
app.post("/api/ai/custom-action", async (req, res) => {
  const { character, customActionPrompt } = req.body;

  if (Date.now() < quotaCooldownUntil) {
    const fallbackResult = generateFallbackCustomResult(character, customActionPrompt);
    return res.json({ success: true, result: fallbackResult, isFallback: true });
  }

  try {
    const ai = getGeminiClient();

    const prompt = `You are the narrator of a BitLife-style life simulator game.
The player age ${character.age} (${character.firstName} ${character.lastName}, Job: ${character.currentJob ? character.currentJob.title : 'None'}, Bank: $${character.bankBalance}) wants to perform a custom action in game:
"${customActionPrompt}"

Evaluate if this action succeeds or fails with a humorous, dramatic, or realistic consequence.
Respond strictly in JSON format with this exact schema:
{
  "resultText": "2-3 sentences explaining what happened when they attempted this action.",
  "statChanges": { "happiness": 10, "health": -5, "smarts": 0, "looks": 0, "karma": -10 },
  "moneyChange": 500,
  "jailYears": 0
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      }
    });

    const jsonText = response.text || "{}";
    const resultData = JSON.parse(jsonText);
    res.json({ success: true, result: resultData });
  } catch (error: any) {
    const errStr = String(error?.message || error);
    if (errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED')) {
      quotaCooldownUntil = Date.now() + 60000; // 60 seconds cooldown
    }
    const fallbackResult = generateFallbackCustomResult(character, customActionPrompt);
    res.json({ success: true, result: fallbackResult, isFallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeSim BitLife Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
