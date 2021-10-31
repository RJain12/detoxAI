const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// option command name
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help to use the bot!')
};

module.exports.run = async (interaction,client,db,guild,member) => {
    interaction.reply({ embeds: [
        new MessageEmbed()
            .setColor(7575280)
            .setTitle('Get Help With Detox.ai')
            .setDescription('Detox.ai is an advanced AI auto-moderation bot. Detox detects context to truly determine if something is innapropriate for your server. The algorithm is quite strict and as such, Detox is recommended for servers that want to keep a PG/PG-13 environment at all times.\n\n**Get Started**\nAdd it to your server, run `/setup` and you\'re done!\n\n[Invite Bot to Server](https://discord.com/api/oauth2/authorize?client_id=784109092330799124&permissions=8&scope=bot%20applications.commands) | [Support Server](https://discord.gg/J4xpV78Cbs)')
            .setTimestamp()
    ]})
};