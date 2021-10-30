const { isDev } = require('../helper/util.js');

module.exports = {
	name: 'messageCreate',
};

module.exports.run = async (message, client, db) => {
	if (message.author.bot || !message?.content) return;
	if (message.content.startsWith(`<@!784109092330799124>`)) return message.reply('Detox is a slash-command Discord bot.\nType `/help` and select Detox to get started!');
	
    
    
    if (!isDev(message)) return;
	if (!message.content.startsWith('>')) return;
	const args = message.content.slice('>'.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.devcmds.get(commandName) || client.devcmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
	return command.run(message, client, args, db, command);
};