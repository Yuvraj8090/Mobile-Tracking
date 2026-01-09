require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const socketHandler = require('./socket');
const store = require('./store');

const app = express();
app.use(cors());
app.use(express.json());

/* HTTP SERVER */
const server = http.createServer(app);

/* SOCKET SERVER */
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

/* Attach socket logic */
socketHandler(io);

/* REST HEALTH CHECK */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Live Location Backend Running',
  });
});

/* REST: GET ALL LIVE USERS */
app.get('/live-users', (req, res) => {
  res.json({
    count: store.getAllUsers().length,
    users: store.getAllUsers(),
  });
});

/* START SERVER */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
