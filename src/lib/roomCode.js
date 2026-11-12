export function generateRoomCode() {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `room-${number}`;
}

/**
 * Room codes are case-insensitive from the user's point of view: the teacher
 * creates "room-46163" while students may type "ROOM-46163". Socket.io room
 * names are case-sensitive, so every side must agree on one canonical form.
 *
 * NOTE: the socket server normalises room ids independently (see
 * socketHandlers/room.js) so it stays authoritative even if a client sends
 * an unexpected casing.
 */
export function normalizeRoomCode(code) {
  return String(code || "")
    .trim()
    .toLowerCase();
}
