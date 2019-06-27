const { prefix } = require('../../config.json');

module.exports = {
	name: 'muet',
	description: 'Selon la commande, mute un utilisateur sur une certaine zone pendant un temps indiqué',
	execute(message, args) {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('Pas les droits');
		
		// mute @sanctioneduser duree raison canal
		const taggedUser = message.mentions.users.first();

		taggedUser.send(`Vous avez reçu un avertissement de ${message.author} :` + message.content.substr((prefix + this.name + taggedUser + '>').length));
		message.author.send(`Vous avez envoyé un message à ${taggedUser} pour lui dire: ` + message.content.substr((prefix + this.name + taggedUser + '>').length));
	},
};