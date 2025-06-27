const { Redis } = require('@upstash/redis');
// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

module.exports = function handleAnswerValidation(io, socket) {
    socket.on('answer-validate', async ({ studentId, questionId, selectedAnswer, testId = "" }) => {
        try {
            console.log("answer validate")
            console.log(questionId)
            const redisKey = `test:${testId}`;
            console.log(redisKey)
            const questionData = await redis.get(redisKey);
            console.log("fetched from redis", questionData)



            // Remove this line - data is already parsed
            // const questionsFromRedis = JSON.parse(questionData);

            // Use questionData directly since it's already an array
            const questionsFromRedis = questionData;

            if (!questionData || !Array.isArray(questionData)) {
                return socket.emit('answer-result', { correct: false, error: 'Question expired or missing' });
            }

            const question = questionsFromRedis.find(q => q.id === questionId);
            console.log("question found ", question)

            if (!question) {
                return socket.emit('answer-result', { correct: false, error: 'Question not found' });
            }

            console.log("question found ", question.answer)

            const isCorrect = question.answer === selectedAnswer ? true : false;

            fetch("http://localhost:3000/api/add-result", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    testId,
                    questionId,
                    selectedAnswer,
                    isCorrect,
                }),
            }).then(() => {
                console.log("✅ Result stored in DB");
            }).catch((e) => {
                console.error("❌ Failed to store result in DB", e);
            });
            // if(isCorrect){
            //     // SEND ANSWER TO DB 


            //     console.log("correct answer")
            // } else {
            //     // SEND TO DB SAYING ITS WRONG
            //     console.log("wrong")
            //     // socket.emit('answer-result', { correct: false, correctAnswer: question.answer });
            // }
        } catch (error) {
            console.error('Error validating answer:', error);
            // socket.emit('answer-result', { correct: false, error: 'Internal Server Error' });
        }
    })
}