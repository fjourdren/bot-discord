const { Client } = require('pg');
const { infoDB } = require('../config.json');

async function queryAsync(query, values) {

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
}

(async () => {
	console.log(await queryAsync('SELECT * FROM utilisateur WHERE id = $1', ['296319337424355330']));
})();