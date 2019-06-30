const dbClient = require('../database.js');

module.exports = {
	name: 'listrank',
	description: 'Affiche les rôles d\'un serveur',
	async execute(message, args) {
		const roleServeur = await dbClient.getAllRanks(message.guild.id);
		let messageRole = 'Les rôles existants sur ce serveur sont les suivants :';
		for (const o of roleServeur) {
			messageRole += ('\n' + o.name);
		}
		message.channel.send(messageRole);

	},
};
