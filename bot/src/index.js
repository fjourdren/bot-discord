const { prefix, TOKEN } = require('../config.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	// event triggered -> le bot est lancé
	console.log('Ready');
	console.log('prefix utilisé -> ' + prefix);
	client.user.setActivity(`Actuellement sur  ${client.guilds.size} serveurs`);
});

client.on('message', message => {
	// event triggered -> un message est envoyé
	if(!message.author.bot) {
		if(message.content.startsWith(`${prefix}ping`)) {
			message.channel.send('Pong' + message.content.substr(`${prefix}ping`.length));
		}
		if(message.content.startsWith(`${prefix}say`)) {
			message.channel.send(message.content.substr(`${prefix}say `.length));
		}
	}
});

client.on('guildCreate', guild => {
	// event triggered -> Le bot rejoind un serveur
	console.log(`Nouveau serveur rejoint : ${guild.name} (id: ${guild.id}). ${guild.memberCount} membres !`);
});

client.login(TOKEN);

