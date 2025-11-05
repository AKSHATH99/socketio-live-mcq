

module.exports = function handleChatSocket(io, socket) {
  socket.on('send-message', ({ roomId, message }) => {
    console.log(`💬 Message to room ${roomId}: ${message}`);
    
    io.in(roomId).emit('receive-message', {
      message,
      sender: socket.id,
    });
  });
};
