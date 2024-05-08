const socketIo = require('socket.io');

let io;

function init(server) {
	io = socketIo(server, {
		cors: {
			origin: '*'
		}
	});

	io.on('connection', (socket) => {
		console.log('A user connected');
		socket.on('disconnect', () => {
			console.log('User disconnected');
		});
	});
}

function emitMessage(userId) {
	if (io) {
		io.emit(`notification-user-${userId}`, "Emit notification");
	} else {
		console.error('Socket.io is not initialized');
	}
}

module.exports = {
	init,
	emitMessage
};

