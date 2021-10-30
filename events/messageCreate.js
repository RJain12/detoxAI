const { isDev, fetchLogChannel } = require('../helper/util.js');
const { MessageEmbed } = require('discord.js');
const deepai = require('deepai');

deepai.setApiKey(process.env.DEEPAI);

const analyzeImage = async (url) => {
    var resp = await deepai.callStandardApi("content-moderation", {
        image: url,
    });
    return resp;
}

const toxicity = require('@tensorflow-models/toxicity');
const threshold = 0.6;
const axios = require('axios');

module.exports = {
    name: 'messageCreate',
};

module.exports.run = async (message, client, db) => {
    if (message.author.bot) return;
    if (client.guildList.indexOf(message.guild.id) < 0) return;
    if (message.content.length) {
        toxicity.load(threshold).then(model => {
            const sentences = [message.content];
            model.classify(sentences).then(async predictions => {
                for (obj of predictions) {
                    if (obj.results[0].match) {
                        await message.delete();
                        const logChannel = await fetchLogChannel(message.guild.id);
                        const lC = client.channels.cache.get(logChannel[0]);
                        if (logChannel && lC) {
                            await lC.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor(7575280)
                                        .setTitle(`Innapropriate Message Detected | Type: ${obj.label}`)
                                        .setDescription(`**${message.author.tag}** sent a message in <#${message.channel.id}> which was deleted!\n\nClick below to reveal message sent:\n||${message.content}||`)
                                        .setTimestamp()
                                ]
                            })
                        }
                        return message.author.send(`:warning: Hello <@!${message.author.id}>, you sent a message classified as ${obj.label} in **${message.guild.name}** saying ||${message.content}||.\nPlease __refrain from this type of language__ in the future. If this seems like a mistake, try rephrasing what you said to make it less toxic.`);
                    }
                }
            });
        });
    }
    if (message.attachments) {
        for (const file of message.attachments) {
            const score = await analyzeImage(file[1].proxyURL);
            if (score > 0.5) {
                await message.delete();
                const logChannel = await fetchLogChannel(message.guild.id);
                const lC = client.channels.cache.get(logChannel[0]);
                if (logChannel && lC) {
                    await lC.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(7575280)
                                .setTitle(`Innapropriate Image Detected | Type: NSFW`)
                                .setDescription(`**${message.author.tag}** sent an image in <#${message.channel.id}> which was deleted!\n\nClick below to reveal link of image sent:\n||${file[1].proxyURL}||`)
                                .setTimestamp()
                        ]
                    })
                }
                return message.author.send(`:warning: Hello <@!${message.author.id}>, you sent an image classified as \`NSFW\` in **${message.guild.name}**.\nPlease __refrain from these types of images__ in the future. If this seems like a mistake, try sending a different image.`);
            }
        }
    }
    if (message.content.startsWith(`<@!784109092330799124>`)) return message.reply('Detox is a slash-command Discord bot.\nType `/help` and select Detox to get started!');

    if (!message.content.startsWith('>')) return;
    if (!isDev(message)) return;
    const args = message.content.slice('>'.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.devcmds.get(commandName) || client.devcmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    return command.run(message, client, args, db, command);
};