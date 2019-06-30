const dbClient = require('../database.js');

module.exports = {
	name: 'myrank',
	description: 'Affiche l\'ensemble des rôles de l\'autheur du message sur le serveur.',
	async execute(message, args) {
		const roleServeur = await dbClient.getRankUtilisateur(message.author.id, message.guild.id);
		let messageRole = 'Vos rôles sur le serveur :';
		for (const o of roleServeur) {
			messageRole += ('\n' + o.name);
		}
		message.channel.send(messageRole);

	},
};
