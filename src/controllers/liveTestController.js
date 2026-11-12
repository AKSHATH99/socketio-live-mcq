
// src/controllers/testController.js
const { prisma } = require('../lib/prisma');
const { redis } = require('../lib/redis');
function liveTestController(io) {
    return {
        sendQuestions: async (req, res) => {
            try {
                console.log("sending questions")
                const { testid, roomId } = req.body;

                if (!testid) {
                    return res.status(400).json({ error: 'testid is required' });
                }

                const questions = await prisma.question.findMany({
                    where: {
                        testId: testid
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                });

                if (!questions || questions.length ==0) {
                    return res.status(400).json({ error: "Couldnt fetch questions" })
                }


                // Cache the questions for answer validation. This is best-effort:
                // the database stays the source of truth, so a cache failure
                // must never stop the live test from starting.
                try {
                    await redis.set(`test:${testid}`, JSON.stringify(questions), {
                        ex: 60 * 60, // ⏱️ expires in 1 hour
                    });
                } catch (cacheError) {
                    console.error('Error caching questions:', cacheError.message);
                }

                console.log(questions);


                let accumulatedTime = 0;

                //run timer to send it 

                questions.forEach((question, index) => {
                    const timerInMs = question.timer * 1000;

                    setTimeout(() => {
                        console.log(`🚀 Sending Question ${index + 1}:`, question.question);

                        io.to(roomId).emit('recieve-questions', question);
                    }, accumulatedTime);


                    accumulatedTime += timerInMs;
                });
                
                setTimeout(() => {
                io.to(roomId).emit('test-ended', roomId , testid)
                }, accumulatedTime);

                return res.status(201).json("");
            } catch (err) {
                console.error('Error creating test:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
}

module.exports = liveTestController