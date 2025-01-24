const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Socket.IO API is running!' });
});

// Event ketika ada client yang terkoneksi
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Mendengarkan event custom dari client
  socket.on('tracking', (location) => {
    console.log('Data received:', location);

    // Kirim balasan ke client
    socket.broadcast.emit('receive-location', {location:location,id:socket.id} );
  });

  // Ketika client terputus
  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
    socket.broadcast.emit('remove-marker', { id: socket.id });
  });
});

// Menjalankan server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO API is running on port ${PORT}`);
});