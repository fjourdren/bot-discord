const { infoDB } = require('../../config.json');
const { Client } = require('pg');

module.exports = {
	name: 'free',
	description: 'Libère un utilisateur d\'une sanction, !free <idsanction>. Pour obtenir l\'id, !sanctionjoueur <@idjoueur> ou !sanctionmodo <@idmodo>',
	execute(message, args) {
		const client = new Client(infoDB);
		client.connect();
		// verif droit

		// --l'utilisateur <$1> a des droits sur toutes les zones obtenues dans cette query
		const queryListDroitUser = '\
		SELECT area_id\
		FROM rank_utilisateur inner join rank on rank.id = rank_id\
		WHERE utilisateur_id="$1"';

		const queryDroitAreaSanction = '\
		SELECT area_id, area_type\
		FROM sanction_utilisateur inner join area_serveur on affected_area_id = area_id\
		WHERE id="$1"';

		client.query(queryListDroitUser, [message.author.id], (err, res) => {
			if (err) {
				console.log(err.stack);
			}
			else {
				/*
				client.query(queryDroitAreaSanction, [message.channel.id], (err, res2) => {
					if (err) {
						console.log(err.stack);
					}
					else {
						// Last verif before insert

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
				*/
			}
		});
		client.end();
	},
};