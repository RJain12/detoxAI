const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { storeLog } = require('../helper/util.js')

// option command name
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the bot!')
        .addChannelOption(option => option
            .setName('log-channel')
            .setDescription('The log channel')
            .setRequired(true)
		),
};

module.exports.run = async (interaction,client,db,guild,member) => {
    if (!member.permissions.has(`ADMINISTRATOR`)) return interaction.reply('Hello, you are not an administrator of this server!\nPlease tell an admin to set the bot up!')
    if (!guild.me.permissions.has('MANAGE_MESSAGES','EMBED_LINKS')) return interaction.reply('Please give me permissions to MANAGE_MESSAGES and EMBED_LINKS in this Discord server! Alternatively, you can give me administrator. These permissions are essential for my auto-moderation capabilities.')
    const chan = client.channels.cache.get(interaction.options._hoistedOptions[0].value);
    await db.firestore().collection('guilds').doc(guild.id).set({ 'logChannel': [chan.id] })
    await db.firestore().collection('guilds').doc('guilds').update({
        guilds: db.firestore.FieldValue.arrayUnion(guild.id)
    });
    client.guildList.push(guild.id)
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setColor(7575280)
                .setTitle('Setup Finished!')
                .setDescription('Detox is now set up in your server!\nMy AI auto-moderator will keep your server safe.\nFeel free to change this log channel at any time.')
                .setTimestamp()
        ]
    })
};