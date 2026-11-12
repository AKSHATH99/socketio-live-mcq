/**
 * Room / lobby socket handlers.
 *
 * Two things matter here:
 *
 * 1. Room ids are normalised. The teacher creates a room like "room-46163"
 *    while a student may type "ROOM-46163". Socket.io room names are
 *    case-sensitive, so without normalisation the two never land in the same
 *    room and the student silently never connects.
 *
 * 2. `join-room` acknowledges the request. `socket.emit()` returns the socket
 *    instance, not the server's response, so the client cannot tell whether
 *    the join actually succeeded.
 *
 * Students are tracked internally by their id (so two students sharing a name
 * never collide) and published as `{ [name]: ready }`, which is the shape the
 * teacher dashboard already consumes.
 */

// roomId -> { [studentId]: { name, ready } }
const lobbyStatus = {};

const normalizeRoomId = (roomId) =>
  String(roomId || '')
    .trim()
    .toLowerCase();

module.exports = function handleRoomSocket(io, socket) {
  const getRoom = (roomId) => {
    const room = normalizeRoomId(roomId);

    if (!lobbyStatus[room]) {
      lobbyStatus[room] = {};
    }

    return room;
  };

  // Publish the lobby as { [name]: ready } for the teacher UI.
  const buildLobbyPayload = (room) => {
    const payload = {};

    for (const [studentId, student] of Object.entries(lobbyStatus[room] || {})) {
      let key = student.name || studentId;

      // Two students may share a name - keep the entries distinguishable.
      while (payload[key] !== undefined) {
        key = `${key} (${studentId.slice(0, 4)})`;
      }

      payload[key] = student.ready;
    }

    return payload;
  };

  const emitLobbyStatus = (room) => {
    io.to(room).emit('lobby-status', buildLobbyPayload(room));
  };

  const removeStudent = (room, studentId) => {
    if (!room || !studentId || !lobbyStatus[room]) return;

    delete lobbyStatus[room][studentId];

    if (Object.keys(lobbyStatus[room]).length === 0) {
      delete lobbyStatus[room];
    } else {
      emitLobbyStatus(room);
    }
  };

  socket.on('join-room', (roomId, userId, role, callback) => {
    const room = normalizeRoomId(roomId);

    if (!room) {
      if (typeof callback === 'function') {
        callback({ ok: false, error: 'Invalid room code' });
      }
      return;
    }

    socket.join(room);
    socket.data.roomId = room;
    socket.data.role = role || 'guest';

    console.log(`🟢 ${socket.data.role} - ${userId || socket.id} joined room ${room}`);

    // Only students are tracked in the lobby status.
    if (socket.data.role === 'student' && userId) {
      const room2 = getRoom(room);
      const existing = lobbyStatus[room2][userId];

      socket.data.studentId = userId;

      lobbyStatus[room2][userId] = {
        name: existing?.name || userId,
        ready: false,
      };

      emitLobbyStatus(room2);
    } else {
      getRoom(room);
    }

    if (typeof callback === 'function') {
      callback({ ok: true, roomId: room });
    }
  });

  socket.on('lobby-status-update', (roomId) => {
    const room = normalizeRoomId(roomId);

    if (!lobbyStatus[room]) return;

    io.to(room).emit('lobby-status', buildLobbyPayload(room));
  });

  socket.on('open-student-lobby', ({ testData, roomId } = {}) => {
    const room = normalizeRoomId(roomId);

    if (!room) return;

    io.to(room).emit('open-student-lobby', testData); // This sends to all sockets in the room
    console.log(`🔵 Student lobby opened for room with data of question ${testData}`);
  });

  socket.on('close-student-lobby', ({ roomId } = {}) => {
    const room = normalizeRoomId(roomId);

    if (!room) return;

    io.to(room).emit('close-student-lobby');
    console.log(`🔴 Student lobby closed for room ${room}`);
  });

  socket.on('student-ready', ({ roomId, studentName } = {}) => {
    const room = normalizeRoomId(roomId);

    if (!room || !lobbyStatus[room]) return;

    // The student is identified by the socket that joined, so the same key is
    // used here as it was in "join-room".
    const studentId = socket.data?.studentId;

    if (!studentId || !lobbyStatus[room][studentId]) return;

    const existing = lobbyStatus[room][studentId];

    lobbyStatus[room][studentId] = {
      name: studentName || existing.name || studentId,
      ready: true,
    };

    emitLobbyStatus(room);
    console.log(studentName, "ready in ", room);

    const students = Object.values(lobbyStatus[room]);
    const allReady = students.length > 0 && students.every((student) => student.ready);

    if (allReady) {
      io.to(room).emit('all-students-ready');
      console.log(`✅ All students in ${room} are ready`);
    }
  });

  socket.on('leave-room', (payload) => {
    // Accept both the raw room id and the { roomId } object form.
    const room = normalizeRoomId(
      typeof payload === 'string' ? payload : payload?.roomId
    );

    if (!room) return;

    socket.leave(room);
    console.log(`🔴 ${socket.id} left room ${room}`);

    removeStudent(room, socket.data?.studentId);

    socket.data.roomId = null;
    socket.data.studentId = null;
  });

  // Remove the student from the lobby when their connection drops.
  socket.on('disconnect', () => {
    removeStudent(socket.data?.roomId, socket.data?.studentId);
  });
};
