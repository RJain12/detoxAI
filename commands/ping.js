const { embedColor, footerTxt, footerImg, important } = require('../config.js');
const Discord = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Pings the bot!',
	cooldown: 3,
};

module.exports.run = async (_, message, __) => {
	try {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor('detox.ai is online & connected to Discord!')
			.setDescription('<a:loading:714010263577428010> Ping, pong! Time taken: `' + Math.round(new Date().getTime() - message.createdTimestamp) + '` ms.')
			.addFields([
				{ name: 'Memory (RAM)', value: 'Available: `' + eval(Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 10) / 10) + '` MB, ' + 'Used: `' + eval(Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 10) / 10) + '` MB' },
				{ name: 'Shard ID', value: message.guild.shardID.toString(), inline: true },
				{ name: 'Cluster', value: 'useast1a', inline: true },
				{ name: '<:YTverifiedbot:715768664611094558> Important Links', value: important },

			])
			.setTimestamp()
			.setFooter(footerTxt, footerImg);
		message.channel.send(helpEmbed);
	}
	catch (err) {
		message.reply('Please give me the `EMBED LINKS` permission.');
		console.error(`PNG0: ${err}`);
	}
};