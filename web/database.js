const { Client } = require('pg');
const { infoDB } = require('./config');

module.exports = {

    /**
     * get user's servers
     */
    // récupère la liste des serveurs de l'utilisateur
	getServers : async function(authId) {
        try {
            const client = new Client(infoDB);

            client.connect();
            const queryString = 'SELECT * FROM serveur WHERE owner_utilisateur_id = $1';
            let servers = await client.query(queryString, [authId]);
            client.end();

            return servers;
        } catch(error) {
            console.log(error);
            throw error;
        }
    },



    /**
     * is owner
     */
    // vérifie si la personne est propriétaire du serveur
    isOwner : async function(authId, serverId) {
        try {
            const client = new Client(infoDB);
            let output = false;

            client.connect();
            const queryString = 'SELECT * FROM serveur WHERE owner_utilisateur_id = $1';
            let servers = await client.query(queryString, [authId]).then().catch(e => { throw e });
            client.end();

            if(servers.rows && servers.rows.length > 0) {
                let serversRows = servers.rows;
                serversRows.forEach(serv => {
                    if(serv.id == serverId) {
                        output = true;
                    }
                });
            }

            return output;
        } catch(error) {
            console.log(error);
            throw error;
        }

    },
    

    /**
     * Grades
     */
    // ajout d'un grade
    addRank : async function(authId, serverId, name) {
        try {
            const client = new Client(infoDB);
        
            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'INSERT INTO rank(name, area_id) VALUES ($1, $2)';
                await client.query(queryString, [name, serverId]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
            throw error;
        }
        
    },


    // del d'un grade
    delRank : async function(authId, serverId, idRank) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'DELETE FROM rank WHERE id=$1 AND area_id=$2';
                await client.query(queryString, [idRank, serverId]).then().catch(e => { throw e });;
                client.end();
            }
        } catch(error) {
            console.log(error);
            throw error;
        }
    },
    

    // récupère les grades d'un serveur
    getRanks : async function(authId, serverId) {
        try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'SELECT * FROM rank WHERE area_id=$1';
                let output = await client.query(queryString, [serverId]).then().catch(e => { throw e });
                client.end();

                return output;
            }
        } catch(error) {
            console.log(error);
            throw error;
        }
    },


    
    /**
     * behavior
     */
    // récupère les comportement d'un serveur
    getBehaviorsServer : async function(authId, serverId) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'SELECT * FROM behavior_serveur JOIN behavior ON behavior.name = behavior_serveur.behavior_name WHERE serveur_id=$1  ORDER BY name';
                let output = await client.query(queryString, [serverId]).then().catch(e => { throw e });
                client.end();

                return output;
            }
        } catch(error) {
            console.log(error);
        }
    },
    

    // changement de valeur sur un comportement
    setBehaviorServer : async function(authId, serverId, behavior_name, enabled) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'UPDATE behavior_serveur SET enabled=$1 WHERE behavior_name=$2 AND serveur_id=$3';
                await client.query(queryString, [enabled, behavior_name, serverId]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },
    


    /**
     * sanctions
     */
    // récupération de toutes les sanctions
    getSanctions : async function() {
		try {
            const client = new Client(infoDB);

            client.connect();
            const queryString = 'SELECT * FROM sanction ORDER BY name';
            let output = await client.query(queryString).then().catch(e => { throw e });
            client.end();

            return output;
        } catch(error) {
            console.log(error);
        }
    },


    /**
     * commandes
     */
    // récupération des commandes d'un serveur
    getCommandsServer : async function(authId, serverId) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'SELECT * FROM command WHERE serveur_id=$1';
                let output = await client.query(queryString, [serverId]).then().catch(e => { throw e });
                client.end();

                return output;
            }
        } catch(error) {
            console.log(error);
        }
    },


    // ajout d'une commande
    addCommandsServer : async function(authId, serverId, pattern_command, sanction_name) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'INSERT INTO command(pattern_command, sanction_name, serveur_id) VALUES ($1, $2, $3)';
                await client.query(queryString, [pattern_command, sanction_name, serverId]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },


    // del d'une commande
    delCommandServer : async function(authId, serverId, commandId) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'DELETE FROM command WHERE id = $1 AND serveur_id=$2';
                await client.query(queryString, [commandId, serverId]);
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },

    

    /**
     * Log
     */
    // récupération valeurs paramètres
    getServerInfos : async function(authId, serverId) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'SELECT * FROM serveur WHERE id=$1';
                let output = await client.query(queryString, [serverId]).then().catch(e => { throw e });
                client.end();

                return output;
            }
        } catch(error) {
            console.log(error);
        }
    },


    // changement paramètres log
    setLogChannels : async function(authId, serverId, channelIdMessages, channelIdCommands) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'UPDATE serveur SET idLogMessage = $1, idLogCommand = $2 WHERE id = $3';
                await client.query(queryString, [channelIdMessages, channelIdCommands, serverId]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },



    /**
     * liaisons commande / grade
     */
    // récupératopn des liaisons commande / grade
    getLiaisonCommandRankServer : async function(authId, serverId) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'select * from command_rank inner join rank on rank_id = rank.id inner join command on command_id = command.id inner join area_serveur on rank.area_id = area_serveur.area_id where area_serveur.serveur_id = $1';
                let output = await client.query(queryString, [serverId]).then().catch(e => { throw e });
                client.end();

                return output;
            }
        } catch(error) {
            console.log(error);
        }
    },


    // ajout d'une liaison commande / grade
    addLiaisonCommandRankServer : async function(authId, serverId, command_id, rank_id) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'INSERT INTO command_rank(command_id, rank_id) VALUES ($1, $2)';
                await client.query(queryString, [command_id, rank_id]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },


    // del d'une liaison commande / grade
    delLiaisonCommandRankServer : async function(authId, serverId, command_id, rank_id) {
		try {
            const client = new Client(infoDB);

            if(this.isOwner(authId, serverId)) {
                client.connect();
                const queryString = 'DELETE FROM command_rank WHERE command_id = $1 AND rank_id = $2';
                await client.query(queryString, [command_id, rank_id]).then().catch(e => { throw e });
                client.end();
            }
        } catch(error) {
            console.log(error);
        }
    },
};