/**
 * In-memory store for live users
 * Can be replaced with Redis later
 */

const liveUsers = new Map();

module.exports = {
  setUserLocation(socketId, data) {
    liveUsers.set(socketId, data);
  },

  removeUser(socketId) {
    liveUsers.delete(socketId);
  },

  getAllUsers() {
    return Array.from(liveUsers.entries()).map(([id, location]) => ({
      userId: id,
      location,
    }));
  },
};
