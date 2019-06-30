const dbClient = require('../database.js');

module.exports = {
	name: '!',
	description: 'Prefix pour les commandes personnalisées du serveur.\nUtiliser la syntaxe suivant : test(user:idUser, duration:uneDuree, reason:uneRaison, area:idZone)\nAvec idUser un identifiant, duree un nombre en jours, uneRaison un message sans paranthèses et idZone l\'id de la zone.',
	async execute(message, args) {
		try {
			const commandName = args[0].match(/.*(?=\()/);
			const user = args[0].match(/user:[^,) ]*/).toString().substring(5);
			const duration = args[1].match(/duration:[^,) ]*/).toString().substring(9);
			const reason = args[2].match(/reason:[^,) ]*/).toString().substring(7);
			const area = args[3].match(/area:[^,) ]*/).toString().substring(5);

			console.log(commandName + user + duration + reason + area);

			const commandServeur = await dbClient.getCommandServeur(commandName, message.guild.id);
			const roleUtilisateur = await dbClient.getRankUtilisateur(message.author.id, message.guild.id);
			console.log(roleUtilisateur);
			console.log(commandServeur);
			if(commandServeur) {
				/*for (o of commandServeur){

				}*/
			}
			else {
				message.channel.send('La commande' + commandName + 'n\'existe pas.');
			}
		}
		catch (error) {
			message.channel.send('Utiliser la syntaxe suivant : test(user:idUser, duration:uneDuree, reason:uneRaison, area:idZone)\nAvec idUser un identifiant, duree un nombre en jours, uneRaison un message sans paranthèses et idZone l\'id de la zone.');
		}

	},
};