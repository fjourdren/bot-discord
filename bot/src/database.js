const { Client } = require('pg');
const { infoDB } = require('../config.json');

module.exports = {

	queryAsync : async function(query, values) {

		const clientDB = new Client(infoDB);

		let res;

		try {
			await clientDB.connect();

			const result = await clientDB.query(query, values);
			res = result.rows;
		}
		finally {
			clientDB.end();
		}
		return await res;
	},

	getAreaRightUser : async function(idUser) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'SELECT area_id\
			FROM rank_utilisateur inner join rank on rank.id = rank_id\
			WHERE utilisateur_id=$1';
			const areaRightUser = await client.query(queryString, [idUser]);
			client.end();

			return areaRightUser.rows;
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	},

	getDroitAreaSanction : async function(idSanction) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'SELECT area_id, area_type\
			FROM sanction_utilisateur inner join area_serveur on affected_area_id = area_id\
			WHERE (id=$1) AND (dateend IS NULL OR dateend > now())';
			const areaRightUser = await client.query(queryString, [idSanction]);
			client.end();

			return areaRightUser.rows[0];
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	},

	endSanction : async function(idSanction) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'UPDATE sanction_utilisateur SET dateend=now() WHERE id = $1;';
			await client.query(queryString, [idSanction]);
			client.end();

			return true;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

	getRoleServeur : async function(idServeur, nomRole) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'select id, name, rank.area_id, area_type, serveur_id from rank inner join area_serveur on rank.area_id = area_serveur.area_id where serveur_id = $1 AND name = $2;';
			const roleServeur = await client.query(queryString, [idServeur, nomRole]);
			client.end();

			return roleServeur.rows[0];
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

	getAllRanks : async function(idServeur) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'select name, serveur_id from rank inner join area_serveur on rank.area_id = area_serveur.area_id where serveur_id = $1';
			const roleServeur = await client.query(queryString, [idServeur]);
			client.end();

			return roleServeur.rows;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

	getCommandServeur : async function(commandName, idServeur) {
		try {
			const client = new Client(infoDB);

			client.connect();
			// add rank_id = '' OR rank_id = '' etc...
			const queryString = 'SELECT command_id, rank_id, sanction_name FROM command inner join command_rank on command.id = command_rank.command_id WHERE pattern_command = $1 AND serveur_id = $2';
			const listeCommand = await client.query(queryString, [commandName, idServeur]);
			client.end();

			return listeCommand.rows;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

	getRankUtilisateur : async function(idUser, idServeur) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'SELECT rank_id, rank.area_id, serveur_id, name FROM rank_utilisateur inner join rank on rank.id = rank_id inner join area_serveur on rank.area_id = area_serveur.area_id\
			WHERE utilisateur_id=$1 AND serveur_id = $2';
			const droitUser = await client.query(queryString, [idUser, idServeur]);
			client.end();

			return droitUser.rows;
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	},

	addRank : async function(idUser, roleServeur) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'INSERT INTO rank_utilisateur values ($1, $2)';
			await client.query(queryString, [idUser, roleServeur]);
			client.end();

			return true;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

	removeRank : async function(idUser, roleServeur) {
		try {
			const client = new Client(infoDB);

			client.connect();
			const queryString = 'DELETE FROM rank_utilisateur WHERE utilisateur_id = $1 AND rank_id = $2';
			await client.query(queryString, [idUser, roleServeur]);
			client.end();

			return true;
		}
		catch(error) {
			console.log(error);
			return false;
		}
	},

};