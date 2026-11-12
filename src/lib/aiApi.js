/**
 * Client for the AI question generator.
 */

export async function generateQuestions(payload) {
  const res = await fetch("/api/generate-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Could not generate questions. Please try again."
    );
  }

  return data.questions || [];
}

export async function fetchAiOptions() {
  const res = await fetch("/api/ai-options", {
    method: "GET",
  });

  const data = await res.json().catch(() => null);

  return data || { topics: [], difficulties: [], audiences: [], maxQuestions: 25 };
}

export async function saveQuestion(question) {
  const res = await fetch("/api/add-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Could not save the question.");
  }

  return data;
}
