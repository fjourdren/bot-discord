const { prefix } = require('../../config.json');

module.exports = {
	name: 'avertir',
	description: 'Avertir un joueur d\'un mauvais comportement.',
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		taggedUser.send(`Vous avez reçu un avertissement de ${message.author} :` + message.content.substr((prefix + this.name + taggedUser + '>').length));
		message.author.send(`Vous avez envoyé un message à ${taggedUser} pour lui dire: ` + message.content.substr((prefix + this.name + taggedUser + '>').length));
		// ${taggedUser.username}
	},
};