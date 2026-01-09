const store = require('./store');

module.exports = function socketHandler(io) {
  io.on('connection', socket => {
    console.log('🟢 Client connected:', socket.id);

    /* 📍 Receive live location */
    socket.on('live-location', data => {
      const locationPayload = {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy || null,
        timestamp: Date.now(),
      };

      store.setUserLocation(socket.id, locationPayload);

      /* 🔁 Broadcast to others */
      socket.broadcast.emit('user-location', {
        userId: socket.id,
        location: locationPayload,
      });
    });

    /* ⏹ Stop sharing */
    socket.on('stop-location', () => {
      store.removeUser(socket.id);
      socket.broadcast.emit('user-disconnected', socket.id);
    });

    /* ❌ Disconnect */
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
      store.removeUser(socket.id);
      socket.broadcast.emit('user-disconnected', socket.id);
    });
  });
};
