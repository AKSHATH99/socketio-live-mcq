module.exports = function handleChatSocket(io, socket) {
  socket.on('send-message', ({ roomId, message } = {}) => {
    // Room ids are normalised the same way as in room.js so both sides of a
    // conversation always land in the same room.
    const room = String(roomId || '')
      .trim()
      .toLowerCase();

    if (!room) return;

    console.log(`💬 Message to room ${room}: ${message}`);

    io.in(room).emit('receive-message', {
      message,
      sender: socket.id,
    });
  });
};
