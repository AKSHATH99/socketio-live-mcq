const { redis } = require('../src/lib/redis');
const { prisma } = require('../src/lib/prisma');

module.exports = function handleAnswerValidation(io, socket) {
    socket.on('answer-validate', async ({ studentId, questionId, selectedAnswer, testId = "", studentName }) => {
        try {
            console.log("answer validate");
            console.log("Received:", { studentId, questionId, selectedAnswer, testId, studentName });

            // The database is the source of truth for the correct answer. The
            // cached copy in Redis is only a fast path, so a Redis outage must
            // not stop students from being scored.
            let question = null;

            try {
                question = await prisma.question.findUnique({
                    where: { id: questionId },
                    select: { id: true, answer: true },
                });
            } catch (dbError) {
                console.error('Error reading question from DB:', dbError.message);
            }

            if (!question) {
                try {
                    const questionData = await redis.get(`test:${testId}`);

                    if (Array.isArray(questionData)) {
                        question = questionData.find(q => q.id === questionId) || null;
                    }
                } catch (redisError) {
                    console.error('Error reading question from cache:', redisError.message);
                }
            }

            if (!question) {
                return socket.emit('answer-result', { correct: false, error: 'Question expired or missing' });
            }

            const isCorrect = question.answer === selectedAnswer;

            try {
                if (isCorrect) {
                    await redis.zincrby(`leaderboard:${testId}`, 1, studentId);
                }
            } catch (leaderboardError) {
                console.error('Error updating live leaderboard:', leaderboardError.message);
            }

            console.log("-----------------------ANSWER STORING-----------------------------");
            console.log("Payload:", { studentId, testId, questionId, selectedAnswer, isCorrect, studentName });

            // ✅ DIRECT DB INSERT — replacing fetch
            await prisma.testResult.create({
                data: {
                    studentId,
                    testId,
                    questionId,
                    selectedAnswer,
                    isCorrect,
                    studentName
                },
            });

            console.log("✅ Result stored in DB via Prisma directly");

        } catch (error) {
            console.error('Error validating answer:', error);
        }
    })
}
