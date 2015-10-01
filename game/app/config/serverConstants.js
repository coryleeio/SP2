module.exports = {
	roomsPerServer: process.env.NUMROOMS || 4,
	playersPerRoom: process.env.PLAYERS_PER_ROOM || 16
};