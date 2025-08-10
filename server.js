const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('./src/lib/googleAuth.js'); // Load strategy

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
  dev,
  conf: {
    useFileSystemPublicRoutes: true,
  }
});

const handle = app.getRequestHandler();
const handleRoomSocket = require('./socketHandlers/room');
const handleQuestionSocket = require('./socketHandlers/questions');
const handleChatSocket = require('./socketHandlers/chat');
const testRoutes = require('./src/routes/testRoutes.js');
const handleAnswerValidation = require('./socketHandlers/answer');

console.log('Starting Next.js app preparation...');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Port: ${port}`);

app.prepare()
  .then(() => {
    console.log('Next.js app prepared successfully');
    const expressApp = express();

    // Middleware
    expressApp.use(express.json());
    expressApp.use(cookieParser());
    expressApp.use(passport.initialize());

    const corsOrigin = process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL, `https://socketio-live-mcq.onrender.com`].filter(Boolean)
      : 'http://localhost:3000';

    expressApp.use(cors({
      origin: corsOrigin,
      credentials: true
    }));

    const server = http.createServer(expressApp);

    const io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production'
          ? [process.env.FRONTEND_URL, `https://socketio-live-mcq.onrender.com`].filter(Boolean)
          : "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true
    });

    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log("new client connected ", socket.id);

      // Modularized socket handlers
      handleRoomSocket(io, socket);
      handleQuestionSocket(io, socket);
      handleChatSocket(io, socket);
      handleAnswerValidation(io, socket);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    expressApp.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        port: port,
        env: process.env.NODE_ENV
      });
    });

    expressApp.use('/api/auth', require('./src/routes/authRoutes.js'));
    expressApp.use('/api', testRoutes(io));

    expressApp.use((req, res) => {
      return handle(req, res);
    });

    server.listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log(`> Ready on port ${port}`);
      console.log(`> Health check available at /health`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((ex) => {
    console.error('Error during Next.js app preparation:', ex);
    console.error('This error suggests an issue with your Next.js pages or API routes');
    console.error('Check your pages/ and pages/api/ directories for malformed routes');
    process.exit(1);
  });