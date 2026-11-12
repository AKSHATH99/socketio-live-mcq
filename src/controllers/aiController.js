const {
  generateQuestions,
  TOPICS,
  DIFFICULTIES,
  AUDIENCES,
} = require('../services/geminiService');

const MAX_QUESTIONS = 25;

const parseCount = (value) => {
  const count = Number.parseInt(value, 10);

  if (!Number.isFinite(count) || count < 1) return 1;
  if (count > MAX_QUESTIONS) return MAX_QUESTIONS;

  return count;
};

module.exports.generateTestQuestions = async (req, res) => {
  try {
    const { audience, topic, difficulty, count, instruction } = req.body || {};

    if (!audience || !topic || !difficulty) {
      return res.status(400).json({
        error: 'Audience, topic and difficulty are required.',
      });
    }

    const questions = await generateQuestions({
      audience,
      topic,
      difficulty,
      count: parseCount(count),
      instruction,
    });

    return res.status(200).json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);

    return res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to generate questions.',
    });
  }
};

module.exports.getAiOptions = async (req, res) => {
  return res.status(200).json({
    topics: TOPICS,
    difficulties: DIFFICULTIES,
    audiences: AUDIENCES,
    maxQuestions: MAX_QUESTIONS,
  });
};
