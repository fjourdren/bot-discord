module.exports = {
	name: 'clear',
	description: 'clear message d\'un utilisateur sur le channel',
	execute(message, args) {
		message.channel.send('pong');
	},
};