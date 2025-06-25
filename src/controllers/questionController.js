const { prisma } = require('../lib/prisma');

module.exports.addQuestionToTest = async (req, res) => {
  try {
    const { testId, question, options, answer, timer } = req.body;

    if (!testId || !question || !options || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newQuestion = await prisma.question.create({
      data: {
        testId,
        question,
        options,
        answer,
        timer: timer || 10, // fallback to 10 seconds
      }
    });

    return res.status(201).json(newQuestion);
  } catch (err) {
    console.error('Error adding question:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.getQuestionsByTestId = async (req, res) => {
  try {
    const { testId } = req.body;

    if (!testId) {
      return res.status(400).json({ error: 'testId is required' });
    }

    const questions = await prisma.question.findMany({
      where: {
        testId
      },
      orderBy: {
        createdAt: 'asc' // Optional: maintain order
      }
    });

    return res.status(200).json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
    
