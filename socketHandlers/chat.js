

module.exports = function handleChatSocket(io, socket) {
  socket.on('send-message', ({ roomId, message }) => {
    console.log(`💬 Message to room ${roomId}: ${message}`);
    
    io.to(roomId).emit('receive-message', {
      message,
      sender: socket.id,
    });
  });
};
