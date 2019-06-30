const dbClient = require('../database.js');

module.exports = {
	name: 'derank',
	description: 'Supprime un grade à un utilisateur !derank @user role',
	async execute(message, args) {
		const idUser = message.author.id;
		const taggedUser = message.mentions.users.first();
		// Avant les requetes sur la base on verifie qu'il y a un argument de type nombre (id)

		if(args[1]) {
			const roleServeur = await dbClient.getRoleServeur(message.guild.id, args[1]);
			const listDroitUser = await dbClient.getAreaRightUser(idUser);
			if(roleServeur && listDroitUser) {
				let droitOK = false;
				for (const o of listDroitUser) {
					if(o.area_id === roleServeur.serveur_id) {
						droitOK = true;
						break;
					}
				}
				if(droitOK && dbClient.removeRank(taggedUser.id, roleServeur.id)) {
					message.channel.send('L\'utilisateur ' + taggedUser + 'n\'a plus le grade de ' + args[1]);
				}
			}
		}
		else {
			message.channel.send('Commande invalide. Réessayez avec \n!derank @user role ou !listrank pour la liste des rôles.');
		}

	},
};
