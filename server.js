// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

// Initialize Next.js app with custom configuration to avoid routing issues
const app = next({ 
  dev,
  conf: {
    // Disable file-system routing that might be causing the issue
    useFileSystemPublicRoutes: true,
  }
});

const handle = app.getRequestHandler();
const handleRoomSocket = require('./socketHandlers/room');
const handleQuestionSocket = require('./socketHandlers/questions');
const handleChatSocket = require('./socketHandlers/chat');
const testRoutes = require('./src/routes/testRoutes.js');

console.log('Starting Next.js app preparation...');

app.prepare()
  .then(() => {
    console.log('Next.js app prepared successfully');
    
    const expressApp = express();
    
    // Parse JSON request bodies
    expressApp.use(express.json());
    
    // Create HTTP server
    const server = http.createServer(expressApp);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log("new client connected ", socket.id);
      
      // Modularized socket handlers
      handleRoomSocket(io, socket);
      handleQuestionSocket(io, socket);
      handleChatSocket(io, socket);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
    
    // Health check endpoint (put this first)
    expressApp.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    // Mount API routes from external file
    expressApp.use('/api', testRoutes(io));
    
    // Let Next.js handle everything else - this was working before
    expressApp.use((req, res) => {
      return handle(req, res);
    });
    
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
      console.log(`> Health check: http://localhost:${port}/health`);
    });
  })
  .catch((ex) => {
    console.error('Error during Next.js app preparation:', ex);
    console.error('This error suggests an issue with your Next.js pages or API routes');
    console.error('Check your pages/ and pages/api/ directories for malformed routes');
    process.exit(1);
  });