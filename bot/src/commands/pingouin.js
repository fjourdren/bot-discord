module.exports = {
	name: 'pingouin',
	description: 'Used for test',
	execute(message, args) {
		message.channel.send('Pingouin', { files: ['./assets/pingouin.gif'] });
	},
};