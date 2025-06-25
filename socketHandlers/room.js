

module.exports = function handleRoomSocket(io, socket) {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`🔴 ${socket.id} left room ${roomId}`);
  });
};
