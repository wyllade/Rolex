import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWithPrompt(
  promptTemplate: string,
  variables: Record<string, string>,
  model = "gpt-4o"
) {
  let prompt = promptTemplate;
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(`{{${key}}}`, value);
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "You are an expert personal branding consultant. Return ONLY valid JSON. No markdown wrapping, no explanation." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content returned from OpenAI");

  return JSON.parse(content);
}

const prompts: Record<string, string> = {
  portfolio: `Generate a portfolio for the user.

User Info:
- Name: {{name}}
- Role: {{role}}
- Experience: {{experience}}
- Skills: {{skills}}
- Projects: {{projects}}
- Goals: {{goals}}
- Target Audience: {{target_audience}}

Generate as JSON with these sections:
1. hero: { headline, subtitle, cta }
2. about: { bio (2-3 paragraphs) }
3. services: [{ title, description, benefit }] (3-5 items)
4. projects: [{ title, description, tech, impact }]
5. skills: { technical: [{ name, level }], soft: [{ name, level }] }
6. cta: { text, action }

Tone: Professional, confident, approachable.`,

  resume: `Generate an ATS-optimized resume for the user.

User Info:
- Name: {{name}}
- Role: {{role}}
- Experience: {{experience}}
- Skills: {{skills}}
- Projects: {{projects}}
- Goals: {{goals}}
- Target Audience: {{target_audience}}

Generate as JSON with:
1. summary: string (2-3 sentences)
2. skills: { category: string, items: string[] }[]
3. experience: [{ title, company, period, achievements: string[] }]
4. projects: [{ name, description, tech: string[] }]
5. education: string
6. certifications: string[]

Use action verbs. Quantify achievements. ATS-friendly.`,

  linkedin_bio: `Generate a LinkedIn bio for the user.

User Info:
- Name: {{name}}
- Role: {{role}}
- Experience: {{experience}}
- Skills: {{skills}}
- Projects: {{projects}}
- Goals: {{goals}}
- Target Audience: {{target_audience}}

Generate as JSON with:
1. headline: string (220 chars max)
2. about: string (hook + story + value + CTA)
3. featured_skills: [{ name, endorsements: number }]
4. keywords: string[]`,

  social_bio: `Generate social media bios for the user.

User Info:
- Name: {{name}}
- Role: {{role}}
- Experience: {{experience}}
- Skills: {{skills}}
- Projects: {{projects}}
- Goals: {{goals}}
- Target Audience: {{target_audience}}

Generate as JSON with:
1. twitter: string (160 chars)
2. github: string (focus on tech stack)
3. instagram: string (emojis, visual-focused)
4. dribbble: string (design-focused)`,
};

export function getPrompt(type: string): string {
  return prompts[type] || prompts.portfolio;
}
