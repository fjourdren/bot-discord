const fs = require('fs');
const Discord = require('discord.js');
const dbClient = require('./database.js');
const { infoDB } = require('../config.json');
const { Client } = require('pg');

const { prefix, TOKEN } = require('../config.json');

const bot = new Discord.Client();

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

bot.once('ready', () => {
	console.log('Ready!');
});

bot.on('messageDelete', messageDelete => {
	// si message supprimé, on vérifie l'existence d'un channel log message, s'il existe, on vérifie qu'il s'agit bien d'un channel textuel du serveur.
	const client = new Client(infoDB);
	client.connect();

	client.query('SELECT idlogmessage from serveur where id = $1;', [messageDelete.guild.id], (err, res) => {
		if (err) {
			console.log(err.stack);
		}
		else {
			bot.channels.get(res.rows[0].idlogmessage).send(`Le message : "${messageDelete.content}" de ${messageDelete.author.tag} a été supprimé.`);
		}
		client.end();
	});
});

bot.on('messageUpdate', (oldMessage, newMessage) => {
	// si message supprimé, on vérifie l'existence d'un channel log message, s'il existe, on vérifie qu'il s'agit bien d'un channel textuel du serveur.
	const client = new Client(infoDB);
	client.connect();

	client.query('SELECT idlogmessage from serveur where id = $1;', [oldMessage.guild.id], (err, res) => {
		if (err) {
			console.log(err.stack);
		}
		else {
			const idChannel = res.rows[0].idlogcommand;
			if(idChannel) {
				bot.channels.get(idChannel).send(`Le message : \n    "${oldMessage.content}"\nde ${oldMessage.author.tag} a été modifié en\n    "${newMessage.content}".`);
			}
		}
		client.end();
	});
});

bot.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!bot.commands.has(commandName)) return;

	const command = bot.commands.get(commandName);

	try {
		// s'il s'agit bien d'une commande, on regarde si on peut l'enregistrer dans le salon correspondant
		command.execute(message, args);
		if(message.channel.type !== 'dm') {
			const client = new Client(infoDB);
			client.connect();
			client.query('SELECT idlogcommand from serveur where id = $1;', [message.guild.id], (err, res) => {
				if (err) {
					console.log(err.stack);
				}
				else {
					const idChannel = res.rows[0].idlogcommand;
					if(idChannel) {
						bot.channels.get(idChannel).send(`${message.author.tag} : "${message.content}"`);
					}
				}
				client.end();
			});
		}
	}
	catch (error) {
		console.error(error);
		message.reply('Erreur en exécutant la commande');
	}
});

bot.on('guildCreate', guild => {
	// event triggered -> Le bot rejoind un serveur
	// Il faut l'enregistrer dans la bdd

	console.log(`Nouveau serveur rejoint : ${guild.name} (id: ${guild.id}). ${guild.memberCount} membres !`);
	dbClient.queryAsync('INSERT INTO serveur(id, name, owner_utilisateur_id) VALUES ($1, $2, $3);', [guild.id, guild.name, guild.owner.id]);
});

bot.on('guildDelete', guild => {
	// event triggered -> Le bot quitte un serveur
	// Il faut le supprimer de la bdd (on garde les sanctions, possibilité de reset la configuration sur le panel admin)

	console.log(`Le bot a quitté la guilde : ${guild.name} (id: ${guild.id}).\nSuppresion des fichiers dans la base`);
	dbClient.queryAsync('DELETE FROM serveur WHERE id = $1;', [guild.id]);
});


bot.login(TOKEN);

