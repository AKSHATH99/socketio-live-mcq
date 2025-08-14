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

module.exports.updateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array is required' });
    }

    // Validate all questions have required fields
    const isValid = questions.every(q =>
      q.question && q.question.trim() !== "" &&
      q.options && Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every(opt => opt.trim() !== "") &&
      q.answer && q.answer.trim() !== "" &&
      q.options.includes(q.answer) &&
      q.timer && typeof q.timer === 'number' && q.timer > 0
    );

    if (!isValid) {
      return res.status(400).json({
        error: 'All questions must have valid question text, 4 options, a correct answer that matches one option, and a positive timer value'
      });
    }

    // Get testId from first question to validate they all belong to same test
    const testId = questions[0].testId;
    if (!testId || !questions.every(q => q.testId === testId)) {
      return res.status(400).json({
        error: 'All questions must belong to the same test'
      });
    }

    // Verify test exists
    const testExists = await prisma.test.findUnique({
      where: { id: testId }
    });

    if (!testExists) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Separate new questions (temp IDs) from existing questions
      const newQuestions = questions.filter(q => q.id.startsWith('temp-'));
      const existingQuestions = questions.filter(q => !q.id.startsWith('temp-'));

      // Get current questions in database for this test
      const currentQuestions = await tx.question.findMany({
        where: { testId },
        select: { id: true }
      });

      const currentQuestionIds = currentQuestions.map(q => q.id);
      const updatedQuestionIds = existingQuestions.map(q => q.id);

      // Delete questions that are no longer in the updated list
      const questionsToDelete = currentQuestionIds.filter(
        id => !updatedQuestionIds.includes(id)
      );

      if (questionsToDelete.length > 0) {
        await tx.question.deleteMany({
          where: {
            id: { in: questionsToDelete }
          }
        });
      }

      // Update existing questions
      const updatePromises = existingQuestions.map(q =>
        tx.question.update({
          where: { id: q.id },
          data: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            timer: q.timer
          }
        })
      );

      // Create new questions
      const createPromises = newQuestions.map(q =>
        tx.question.create({
          data: {
            testId: q.testId,
            question: q.question,
            options: q.options,
            answer: q.answer,
            timer: q.timer
          }
        })
      );

      // Execute all operations
      const [updatedQuestions, createdQuestions] = await Promise.all([
        Promise.all(updatePromises),
        Promise.all(createPromises)
      ]);

      return {
        updated: updatedQuestions,
        created: createdQuestions,
        deleted: questionsToDelete.length
      };
    });

    // Fetch and return all questions for the test
    const allQuestions = await prisma.question.findMany({
      where: { testId },
      orderBy: { createdAt: 'asc' }
    });

    return res.status(200).json({
      message: 'Questions updated successfully',
      summary: {
        updated: result.updated.length,
        created: result.created.length,
        deleted: result.deleted
      },
      questions: allQuestions
    });

  } catch (err) {
    console.error('Error updating questions:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

