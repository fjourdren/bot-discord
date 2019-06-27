const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'Liste l\'ensemble des commandes disponibles sur le serveur et la fonctionnalité associée.',
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Liste des commandes :');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nEnvoyer \`${prefix}help [nom de la commande]\` pour des infos précises!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Toutes les commandes ont été envoyées en mp !');
				})
				.catch(error => {
					console.error(`Erreur mp les commandes à ${message.author.tag}.\n`, error);
					message.reply('Impossibilité d\'envoyer un MP avec les commandes');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name);

		if (!command) {
			return message.reply('La commande n\'existe pas !');
		}

		data.push(`**Name:** ${command.name}`);
		if (command.description) data.push(`**Description:** ${command.description}`);

		message.channel.send(data, { split: true });
	},
};