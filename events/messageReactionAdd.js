const badEmojis = ['🍆', '🍑']
const { fetchLogChannel } = require('../helper/util.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'messageReactionAdd',
};

module.exports.run = async (messageReaction, user, client) => {
    try {
        if (badEmojis.includes(messageReaction._emoji.name)) {
            await messageReaction.remove();
            const guildName = client.guilds.cache.get(messageReaction.message.guildId);
            await user.send(`Hello <@!${user.id}>, please do not use innapropriate emojis for reactions in **${guildName}**!`);
            const logChannel = await fetchLogChannel(messageReaction.message.guildId);
            if (logChannel) {
                const lC = client.channels.cache.get(logChannel[0]);
                await lC.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(7575280)
                            .setTitle('Innapropriate Emoji Detected')
                            .setDescription(`**${user.tag}** sent an innapropriate emoji: \`${messageReaction._emoji.name}\`.\nI have deleted it, and DMed the offending user!`)
                    ]
                })
            }
        }
    } catch (error) {
        console.log(error);
    }
};