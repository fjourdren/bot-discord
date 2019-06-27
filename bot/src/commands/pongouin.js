module.exports = {
	name: 'pongouin',
	description: 'Used for test',
	execute(message, args) {
		message.channel.send('Pongouin', { files: ['./assets/pongouin.gif'] });
	},
};