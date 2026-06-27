const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const getAiProviderName = () => {
  if (GROQ_API_KEY) return "Groq";
  if (GEMINI_API_KEY) return "Gemini";
  return "AI";
};

export const askGemini = async (prompt) => {
  if (GROQ_API_KEY) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Groq API error details:", data.error);
        return "AI error: " + data.error.message;
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq connection error:", error);
      return "AI is thinking... please try again.";
    }
  }

  if (!GEMINI_API_KEY) {
    return "Error: Neither REACT_APP_GEMINI_API_KEY nor REACT_APP_GROQ_API_KEY is configured in your .env file.";
  }

  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const data = await response.json();
    if (data.error) {
      if (data.error.code === 429) {
        return "Rate limit hit! Please wait 1 minute and try again.";
      }
      return "AI error: " + data.error.message;
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "AI is thinking... please try again.";
  }
};


export const analyzeTask = async (title, deadline) => {
  const prompt = `You are a productivity AI assistant. Analyze this task and respond in JSON only.
Task: "${title}"
Deadline: "${deadline}"

Respond with exactly this JSON format:
{
  "urgencyScore": <number 1-10>,
  "urgencyLabel": "<Low/Medium/High/Critical>",
  "estimatedHours": <number>,
  "steps": ["step 1", "step 2", "step 3"],
  "tip": "<one motivational tip>"
}`;
  const result = await askGemini(prompt);
  try {
    const clean = result.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      urgencyScore: 5,
      urgencyLabel: "Medium",
      estimatedHours: 2,
      steps: ["Break task into parts", "Start immediately", "Review when done"],
      tip: "Start now, perfect later!",
    };
  }
};

export const getRescuePlan = async (tasks) => {
  const taskList = tasks.map((t) => `- ${t.title} (due: ${t.deadline})`).join("\n");
  const prompt = `You are an emergency productivity coach. The user is overwhelmed with these tasks:
${taskList}

Give a survival plan in JSON only:
{
  "message": "<encouraging message>",
  "priorityOrder": ["task1", "task2"],
  "dropThese": ["task to drop or postpone"],
  "nextAction": "<single most important thing to do RIGHT NOW>"
}`;
  const result = await askGemini(prompt);
  try {
    const clean = result.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      message: "You've got this! Focus on one thing at a time.",
      priorityOrder: tasks.map((t) => t.title),
      dropThese: [],
      nextAction: "Start with the earliest deadline",
    };
  }
};