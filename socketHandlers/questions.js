// socketHandlers/questions.js
module.exports = function handleQuestionSocket(io, socket) {
  socket.on('send-questions', ({ roomId, questions }) => {
    console.log("📩 Received questions for room:", roomId);
    console.log("Questions with testIds:", questions);
    
    // Forward the questions to all clients in the room
    io.to(roomId).emit('recieve-questions', questions);
  });
};
