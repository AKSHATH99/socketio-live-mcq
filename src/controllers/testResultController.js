// src/controllers/testResultController.js
const { prisma } = require('../lib/prisma');

module.exports.addTestResult = async (req, res) => {
  try {
    const { studentId, testId, questionId, selectedAnswer, isCorrect } = req.body;
    console.log( studentId, testId, questionId, selectedAnswer, isCorrect)
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
