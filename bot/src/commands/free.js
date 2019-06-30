const dbClient = require('../database.js');

module.exports = {
	name: 'free',
	description: 'Libère un utilisateur d\'une sanction, !free <idsanction>. Pour obtenir l\'id, !sanctionjoueur <@idjoueur> ou !sanctionmodo <@idmodo>',
	async execute(message, args) {
		const idUser = message.author.id;
		// Avant les requetes sur la base on verifie qu'il y a un argument de type nombre (id)
		if(!isNaN(args[0])) {
			// verif droit
			const idSanction = parseInt([args[0]]);

			// liste des zones pour lesquels un idUser a des droits
			const listDroitUser = await dbClient.getAreaRightUser(idUser);
			// zone pour laquelle il faut avoir des droits
			const areaRankUser = await dbClient.getDroitAreaSanction(idSanction);

			if((listDroitUser.length > 0) && (areaRankUser !== undefined)) {
				let droitOK = false;
				const idZoneSanction = areaRankUser.area_id;

				for (const o of listDroitUser) {
					if(o.area_id === idZoneSanction) {
						droitOK = true;
						break;
					}
				}
				if(droitOK && await dbClient.endSanction(idSanction)) {
					message.channel.send('Remind the lord to leave his light on for me I\'m free');
				}

			}
		}

	},
};
