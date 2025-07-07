// src/controllers/testResultController.js
const { prisma } = require('../lib/prisma');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


module.exports.addTestResult = async (req, res) => {
  try {
    const { studentId, testId, questionId, selectedAnswer, isCorrect } = req.body;
    console.log(studentId, testId, questionId, selectedAnswer, isCorrect)
    if (!studentId || !testId || !questionId || !selectedAnswer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await prisma.testResult.create({
      data: {
        studentId,
        testId,
        questionId,
        selectedAnswer,
        isCorrect,
      },
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error adding test result:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getTestResults = async (req, res) => {
  try {
    const { testId } = req.query;

    const results = await prisma.testResult.findMany({
      where: testId ? { testId } : {},
      orderBy: { timestamp: "asc" },
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching test results:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports.getLeaderBoard = async (req, res) => {
  try {
    // console.log("hi")
    const { testid } = req.body;

    const results = await prisma.testResult.findMany({
      where: { testId: testid },
    });
    console.log(results);

    const scores = {};

    for (const result of results) {
      if (!scores[result.studentId]) scores[result.studentId] = 0;
      if (result.isCorrect) scores[result.studentId]++;
    }

    const leaderboard = Object.entries(scores)
      .map(([studentId, score]) => ({ studentId, score }))
      .sort((a, b) => b.score - a.score);

    console.log(leaderboard);
    return res.status(201).json(leaderboard);


  } catch (error) {

    console.error("Error fetching test results:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports.getLiveLeaderBoard = async (req, res) => {
  const { testId } = req.body;

  if (!testId) {
    return res.status(400).json({ message: "TestID not received" });
  }

  try {
    const leaderboard = await redis.zrange(`leaderboard:${testId}`, {
      rev: true,               // equivalent to zrevrange
      withScores: true,        // equivalent to WITHSCORES
      limit: { offset: 0, count: 10 }
    });

    const formatted = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      formatted.push({
        studentId: leaderboard[i],
        score: parseInt(leaderboard[i + 1]),
      });
    }

    res.status(200).json({ leaderboard: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch leaderboard" });
  }
};

module.exports.getTestResultsDetailed = async (req, res) => {
  const { testId } = req.body;

  if (!testId) {
    return res.status(400).json({ error: "TestID is required" });
  }

  try {
    // get all results for this test
    const results = await prisma.testResult.findMany({
      where: { testId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { timestamp: "asc" },
    });

    // get all questions for this test
    const questions = await prisma.question.findMany({
      where: { testId },
      select: { id: true, question: true, answer: true, options: true },
    });

    const questionMap = {};
    for (const q of questions) {
      questionMap[q.id] = q;
    }

    // group results by student
    const grouped = {};

    for (const result of results) {
      const questionData = questionMap[result.questionId];

      if (!grouped[result.studentId]) {
        grouped[result.studentId] = {
          student: result.student,
          totalCorrect: 0,
          answers: []
        };
      }
      grouped[result.studentId].answers.push({
        question: questionData?.question ?? "Unknown",
        correctAnswer: questionData?.answer ?? "Unknown",
        options: questionData?.options ?? [],
        selectedAnswer: result.selectedAnswer,
        isCorrect: result.isCorrect
      });
      if (result.isCorrect) {
        grouped[result.studentId].totalCorrect++;
      }
    }

    const final = Object.values(grouped);

    res.status(200).json({ students: final });
  } catch (error) {
    console.error("Error in getTestResultsDetailed", error);
    res.status(500).json({ error: "Server error" });
  }
};



