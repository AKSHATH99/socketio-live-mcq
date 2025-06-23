// initialising custom server using express to support socket.io
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log("new client connected ", socket.id);

    socket.on('join-room', (roomid) => {
      socket.join(roomid);
      console.log(`🟢 ${socket.id} joined room ${roomid}`)
    })

    socket.on('send-message', ({ roomId, message }) => {
      console.log(`💬 Message to room ${roomId}: ${message}`);
      io.to(roomId).emit('receive-message', {
        message,
        sender: socket.id,
      });
    });


    // RECIEVING QUESTIONS AND SENDING IT TO THE ROOM ID
    socket.on('send-questions',({roomId ,questions})=>{
      console.log("Recieved questions in server");
      console.log("mcq: ", questions)

      io.to(roomId).emit("recieve-questions",questions);
    })

    

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  expressApp.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});