const fetch = require('node-fetch');

module.exports = {
    // va récupérer les information d'identification d'un utilisateur connecté à notre app via l'api discord
    getDiscordIdentity: async function getDiscordIdentity(token) {
        const response = await fetch(`http://discordapp.com/api/users/@me`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.json();
    },


    // récupère la liste des channel d'une guilde, avec l'api discord
    getDiscordChannels: async function getDiscordIdentity(token, guildid) {
        const response = await fetch(`http://discordapp.com/api/v6/guilds/${guildid}/channels`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bot ${token}`,
            },
        });

        return response.json();
    },

}