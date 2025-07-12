const lobbyStatus = {};


module.exports = function handleRoomSocket(io, socket) {
  socket.on('join-room', (roomId, userId, role ) => {
    socket.join(roomId);
    console.log(`🟢 ${role} -  ${userId} joined room ${roomId}`);

    // Initialize room if it doesn't exist
    if (!lobbyStatus[roomId]) {
      lobbyStatus[roomId] = {};
    }
    console.log("role is ", role)
    // Only add to lobby status if it's a student
    if (role === 'student') {
      lobbyStatus[roomId][userId] = false;
      console.log("lobby status1", lobbyStatus)
      io.to(roomId).emit('lobby-status', lobbyStatus[roomId]);
    }
  });

  socket.on('student-ready', ({ roomId, studentName }) => {
    if (!lobbyStatus[roomId]) return;

    lobbyStatus[roomId][studentName] = true;

    io.to(roomId).emit('lobby-status', lobbyStatus[roomId]);
    console.log("lobby status2", lobbyStatus)
    console.log(studentName,"ready in ",roomId)

    const allReady = Object.values(lobbyStatus[roomId]).every(status => status === true);

    if (allReady) {
      io.to(roomId).emit('all-students-ready');
      console.log(`✅ All students in ${roomId} are ready`);
    }
  });


  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`🔴 ${socket.id} left room ${roomId}`);

    if (lobbyStatus[roomId]) {
      delete lobbyStatus[roomId][studentId];

      if (Object.keys(lobbyStatus[roomId]).length === 0) {
        delete lobbyStatus[roomId];
      } else {
        console.log("lobby status3", lobbyStatus)
        io.to(roomId).emit('lobby-status', lobbyStatus[roomId]);
      }
    }
  });
};
