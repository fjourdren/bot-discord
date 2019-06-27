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

	queryPromise : function(query, values) {
		const clientDB = new Client(infoDB);
		clientDB.query(query, values)
			.then(res =>{
				console.log(res.rows[0]);
				clientDB.end();
				return res.rows[0];
			})
			.catch(e => console.error(e.stack));
	},
};
/*
(async () => {
	console.log(await queryAsync('SELECT * FROM utilisateur WHERE id = $1', ['296319337424355330']));
})();
*/