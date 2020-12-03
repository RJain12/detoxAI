const { embedColor, footerImg, footerTxt } = require('../config.js');
const Discord = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Invite the bot to your Discord server.',
	cooldown: 3,
};

module.exports.run = async (_, message, __) => {
	try {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor('Invite detox.ai to your Discord server!', footerImg)
			.addFields(
				{ name: '<:mdAnnouncement:783042800257073183> Invite Me', value: '[Click Here to Invite Me](https://discord.com/oauth2/authorize?client_id=784109092330799124&permissions=8&scope=bot)', inline: true },
				{ name: '<:YTcountry:715773844396179476> Support Server', value: '[Join for Help!](https://discord.gg/2nX2eaX)', inline: true },
			)
			.setTimestamp()
			.setFooter(footerTxt, footerImg);
		message.channel.send(helpEmbed);
	}
	catch (err) {
		message.reply('Please give me the `EMBED LINKS` permission.');
		console.error(`INV0: ${err}`);
	}
};