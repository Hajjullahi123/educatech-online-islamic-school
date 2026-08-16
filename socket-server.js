const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.SOCKET_PORT || 3001;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining classroom
  socket.on('classroom:join', ({ classId, isTeacher }) => {
    socket.join(classId);
    console.log(`Socket ${socket.id} joined class room: ${classId} (isTeacher: ${isTeacher})`);
  });

  // Handle Quran coordinates sync
  socket.on('classroom:sync', (data) => {
    const { classId, ...syncData } = data;
    // Broadcast coordinates to everyone in the room except the sender
    socket.to(classId).emit('classroom:sync', syncData);
    console.log(`Synced coordinates in room ${classId}:`, syncData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Al-Qalam Sync Server is listening on port ${PORT}`);
});
