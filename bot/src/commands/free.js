const { infoDB } = require('../../config.json');
const { Client } = require('pg');

module.exports = {
	name: 'free',
	description: 'Libère un utilisateur d\'une sanction, !free <idsanction>. Pour obtenir l\'id, !sanctionjoueur <@idjoueur> ou !sanctionmodo <@idmodo>',
	execute(message, args) {
		const idUser = message.author.id;
		message.channel.send(idUser);
		if(!isNaN(args[0])) {
			// Avant les requetes sur la base on verifie qu'il y a un argument de type nombre (id)
			const client = new Client(infoDB);
			client.connect();
			// verif droit

			// --l'utilisateur <$1> a des droits sur toutes les zones obtenues dans cette query
			const queryListDroitUser = 'SELECT area_id\
			FROM rank_utilisateur inner join rank on rank.id = rank_id\
			WHERE utilisateur_id=$1';
			client.query(queryListDroitUser, [idUser], (err, res) => {
				if (err) {
					console.log(err.stack);
				}
				else if(res.rows.length > 0) {
					const areaRankUser = res.rows ;
					const queryDroitAreaSanction = '\
					SELECT area_id, area_type\
					FROM sanction_utilisateur inner join area_serveur on affected_area_id = area_id\
					WHERE id=$1';
					client.query(queryDroitAreaSanction, [message.channel.id], (err, res2) => {
						if (err) {
							console.log(err.stack);
						}
						else if(res2.rows !== null) {
							// Last verif before insert
							let droitOK = false;
							const idZoneSanction = res2.rows[0].area_id;
							const typeZoneSanction = res2.rows[0].area_type;
							if(typeZoneSanction === 'serveur') {
								droitOK = areaRankUser.includes(idZoneSanction);
							}
							else if(typeZoneSanction === 'categorie') {
								droitOK = areaRankUser.includes(idZoneSanction, message.guild.id);
							}
							else if (typeZoneSanction === 'channel') {
								droitOK = areaRankUser.includes(idZoneSanction, message.guild.channels.get(idZoneSanction).parentID, message.guild.channels.get(idZoneSanction).guild.id);
							}
							// insert
							client.query('UPDATE sanction_utilisateur SET dateend=now() WHERE id = $1;', [args[0]], (err, res3) => {
								if (err) {
									console.log(err.stack);
								}
								else {
									message.channel.send('Remind the lord to leave his light on for me I\'m free');
								}
							});
						}
					});
				}
				client.end();
			});
		}

	},
};
