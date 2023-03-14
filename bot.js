const fs = require('fs');
const { Client, Collection, MessageEmbed, Permissions, Intents } = require('discord.js');
const db = require('firebase-admin');
const service_account = require('./firestoreKey.json');

db.initializeApp({
	credential: db.credential.cert(service_account),
});
console.log('Firestore Successfully Initialized');


const { fetchGuilds } = require('./helper/util.js');

const bot_intents = new Intents();
bot_intents.add('GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS');

const client = new Client({
	allowedMentions: {
		parse: ['users'],
		repliedUser: true,
	},
	intents: bot_intents,
	presence: {
		status: 'online',
		activities: [{
			name: '/help | Click Me!',
			type: 'STREAMING',
			url: 'https://www.youtube.com/watch?v=zYD2VBgabX8',
		}],
	},
});

client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
	client.login(process.env.TOKEN).catch(console.error);
	console.log('Logged in successfully!');
	 client.guildList = await fetchGuilds();
	 console.log(`Guilds: ${client.guildList}`);
})();

const flags = ['MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'SEND_MESSAGES'];
client.permissions = new Permissions(flags);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.devcmds = new Collection();
const devcmdFiles = fs.readdirSync('./devCmds').filter(file => file.endsWith('.js'));
for (const file of devcmdFiles) {
	 const command = require(`./devCmds/${file}`);
	 client.devcmds.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.run(...args, client, db));
	}
	else {
		client.on(event.name, (...args) => event.run(...args, client, db));
	}
}

console.log('Loaded commands!');

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
