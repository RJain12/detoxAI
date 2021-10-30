const { isDev, fetchLogChannel } = require('../helper/util.js');
const { MessageEmbed } = require('discord.js');
const nsfw = require('nsfwjs')
const toxicity = require('@tensorflow-models/toxicity');
const tf = require('@tensorflow/tfjs-node')
const threshold = 0.9;
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
            const pic = await axios.get(file[1].proxyURL, {
                responseType: 'arraybuffer',
            })
            const model = await nsfw.load()
            const image = await tf.node.decodeImage(pic.data, 3)
            const predictions = await model.classify(image)
            image.dispose()
            predictions.shift();
            predictions.shift();
            for (const prediction of predictions) {
                console.log(prediction)
                if (prediction.probability > 0.9) {
                    await message.delete();
                    const logChannel = await fetchLogChannel(message.guild.id);
                    const lC = client.channels.cache.get(logChannel[0]);
                    if (logChannel && lC) {
                        await lC.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(7575280)
                                    .setTitle(`Innapropriate Image Detected | Type: ${prediction.className}`)
                                    .setDescription(`**${message.author.tag}** sent an image in <#${message.channel.id}> which was deleted!\n\nClick below to reveal link of image sent:\n||${file[1].proxyURL}||`)
                                    .setTimestamp()
                            ]
                        })
                    }
                    return message.author.send(`:warning: Hello <@!${message.author.id}>, you sent an image classified as \`${prediction.className}\` in **${message.guild.name}**.\nPlease __refrain from these types of images__ in the future. If this seems like a mistake, try sending a different image.`);
                }
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