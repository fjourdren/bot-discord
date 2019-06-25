const fs = require('fs');
const Discord = require('discord.js');
const dbClient = require('./database.js');

const { prefix, TOKEN } = require('../config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageDelete', messageDelete => {
	// si message supprimé, on vérifie l'existence d'un channel log message, s'il existe, on vérifie qu'il s'agit bien d'un channel textuel du serveur.
	const idlogmessage = (dbClient.queryAsync('SELECT idlogmessage FROM serveur WHERE id = $1;', [messageDelete.guild.id]));
	if(idlogmessage) {
		console.log('id log message : ' + idlogmessage);
	}
	messageDelete.channel.send(`The message : "${messageDelete.content}" by ${messageDelete.author.tag} was deleted.`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('Erreur en exécutant la commande');
	}
});

client.on('guildCreate', guild => {
	// event triggered -> Le bot rejoind un serveur
	// Il faut l'enregistrer dans la bdd

	console.log(`Nouveau serveur rejoint : ${guild.name} (id: ${guild.id}). ${guild.memberCount} membres !`);
	dbClient.queryAsync('INSERT INTO serveur(id, name, owner_utilisateur_id) VALUES ($1, $2, $3);', [guild.id, guild.name, guild.owner.id]);
});

client.on('guildDelete', guild => {
	// event triggered -> Le bot quitte un serveur
	// Il faut le supprimer de la bdd (on garde les sanctions, possibilité de reset la configuration sur le panel admin)

	console.log(`Le bot a quitté la guilde : ${guild.name} (id: ${guild.id}).\nSuppresion des fichiers dans la base`);
	dbClient.queryAsync('DELETE FROM serveur WHERE id = $1;', [guild.id]);
});


client.login(TOKEN);

