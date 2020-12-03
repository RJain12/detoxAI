const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, footerImg, footerTxt, embedColor } = require('./config.js');
const util = require('./dev/util.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
};
client.cooldowns = new Discord.Collection();

const { shardReady, msg, guildCreate, voiceUp } = require('./dev/events.js');
client.on('shardReady', async (id) => { shardReady(client, id) });
client.on('message', async (message) => { msg(message, client, prefix, util) });
client.on('guildCreate', (guild) => { guildCreate(guild, client, embedColor, footerImg, footerTxt) });
client.on("error", (e) => console.error(`${e}`));
client.on("warn", (w) => console.warn(`${w}`));
client.on("debug", (e) => console.info(e));
process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection`, error));

client.login(token);
