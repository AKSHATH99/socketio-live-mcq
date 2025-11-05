const { Redis } = require('@upstash/redis');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = function handleAnswerValidation(io, socket) {
    socket.on('answer-validate', async ({ studentId, questionId, selectedAnswer, testId = "", studentName }) => {
        try {
            console.log("answer validate");
            console.log("Received:", { studentId, questionId, selectedAnswer, testId, studentName });

            const redisKey = `test:${testId}`;
            const questionData = await redis.get(redisKey);

            if (!questionData || !Array.isArray(questionData)) {
                return socket.emit('answer-result', { correct: false, error: 'Question expired or missing' });
            }

            const question = questionData.find(q => q.id === questionId);

            if (!question) {
                return socket.emit('answer-result', { correct: false, error: 'Question not found' });
            }

            const isCorrect = question.answer === selectedAnswer;

            if (isCorrect) {
                await redis.zincrby(`leaderboard:${testId}`, 1, studentId);
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
