export function generateRoomCode() {
  const number = Math.floor(10000 + Math.random() * 90000);
  return `room-${number}`;
}
