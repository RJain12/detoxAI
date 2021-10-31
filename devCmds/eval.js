const util = require('../helper/util.js');

module.exports = {
	name: 'eval',
	aliases: ['e'],
};

module.exports.run = async (message, client, args, db) => {
	try {
		if (!util.isDev(message)) return;
		if (message.content.includes('.env')) return message.reply('Returned due to attempt to access environment variables.');
		let evaled
		if (args[0] !== 'await') {
			evaled = await eval(args.join(' '));
		} else {
			evaled = await eval((async () => { 
				args.join(' ')
			})());
		}
		if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
		const text = util.clean(evaled);
		if (text.length > 2000) {
			const chunks = util.chunkSubstr(text, 2000);
			for (chunk in chunks) {
				return message.reply(`**Result**\`\`\`js\n${chunk}\`\`\``)
			}
		}
		else return message.reply(`**Result**\`\`\`js\n${text}\`\`\``);
	}
	catch (error) {
		return message.reply(`**Eval Error** \`\`\`js\n${error}\`\`\``);
	}
};