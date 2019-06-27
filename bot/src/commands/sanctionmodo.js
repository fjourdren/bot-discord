const { infoDB } = require('../../config.json');
const { Client } = require('pg');

module.exports = {
	name: 'sanctionmodo',
	description: 'Affiche l\'ensemble des sanctions infligées par un modérateur.',
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		if(taggedUser !== null) {
			const client = new Client(infoDB);
			client.connect();
			const sqlQuery = 'select id, datestart, dateend, reason, sanctioned_id, sanction_name, area_id, area_type \
			from sanction_utilisateur inner join area_serveur on affected_area_id = area_id	\
			where serveur_id = $1 AND modo_id = $2';
			const value = [message.guild.id, taggedUser.id];
			client.query(sqlQuery, value, (err, res) => {
				if (err) {
					console.log(err.stack);
				}
				else {
					let messageSanction = `L'utilisateur ${taggedUser} a sanctionné ${res.rows.length} fois.`;
					for (const elem of res.rows) {
						if(message.guild.members.get(elem.sanctioned_id) !== undefined) {
							messageSanction += `\n      id_sanction:${elem.id} - ${message.guild.members.get(elem.sanctioned_id)}`;
						}
						else {
							messageSanction += `\n      id_sanction:${elem.id} - ${elem.sanctioned_id}`;
						}
						messageSanction += ` ${elem.sanction_name} du ${elem.datestart} `;
						if(elem.dateend !== null) {
							messageSanction += `au ${elem.dateend}`;
						}
						else {
							messageSanction += 'jusqu\'à décision contraire';
						}
						messageSanction += ` sur le ${elem.area_type}:${elem.area_id} pour cause "${elem.reason}"`;
					}
					message.channel.send(messageSanction);
				}
				client.end();
			});
		}

	},
};