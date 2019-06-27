const { infoDB } = require('../../config.json');
const { Client } = require('pg');

module.exports = {
	name: 'sanctionjoueur',
	description: 'Affiche l\'ensemble des sanctions d\'un joueur.',
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		if(taggedUser !== null) {
			const client = new Client(infoDB);
			client.connect();
			const sqlQuery = 'select id, datestart, dateend, reason, modo_id, sanction_name, area_id, area_type \
			from sanction_utilisateur inner join area_serveur on affected_area_id = area_id	\
			where serveur_id = $1 AND sanctioned_id = $2';
			const value = [message.guild.id, taggedUser.id];
			client.query(sqlQuery, value, (err, res) => {
				if (err) {
					console.log(err.stack);
				}
				else {
					let messageSanction = `L'utilisateur ${taggedUser} a été sanctionné ${res.rows.length} fois.`;
					for (const elem of res.rows) {
						messageSanction += `\n      id_sanction:${elem.id} - ${elem.sanction_name} du ${elem.datestart} `;
						if(elem.dateend !== null) {
							messageSanction += `au ${elem.dateend}`;
						}
						else {
							messageSanction += 'jusqu\'à décision contraire';
						}
						messageSanction += ` sur le ${elem.area_type}:${elem.area_id} pour cause "${elem.reason}" par `;
						if(message.guild.members.get(elem.modo_id) !== null) {
							messageSanction += message.guild.members.get(elem.modo_id);
						}
						else {
							messageSanction += `l'utilisateur ${elem.modo_id}`;
						}
					}
					message.channel.send(messageSanction);
				}
				client.end();
			});
		}

	},
};