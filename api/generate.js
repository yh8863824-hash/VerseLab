export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt, style, length } = req.body;

  const API_KEY = process.env.GEMINI_API_KEY;

  const lengthGuide =
    length === "short"
      ? "Make it short (1 verse + chorus)"
      : length === "long"
      ? "Make it long (3 verses + chorus + bridge)"
      : "Make it normal length (2 verses + chorus)";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Create a ${style} song.

Idea: ${prompt}

Rules:
- Style: ${style}
- ${lengthGuide}
- Make it catchy
- Include a strong chorus
                `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}