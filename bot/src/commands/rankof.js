const dbClient = require('../database.js');

module.exports = {
	name: 'rankof',
	description: 'Affiche l\'ensemble des rôles de d\'un joueur sur le serveur.',
	async execute(message, args) {
		const taggedUser = message.mentions.users.first();
		const roleServeur = await dbClient.getRankUtilisateur(taggedUser.id, message.guild.id);
		let messageRole = 'Rôles sur le serveur :';
		for (const o of roleServeur) {
			messageRole += ('\n' + o.name);
		}
		message.channel.send(messageRole);

	},
};
