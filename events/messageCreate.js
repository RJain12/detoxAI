const { isDev, fetchLogChannel } = require('../helper/util.js');
const { MessageEmbed } = require('discord.js');
const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: process.env.PERSPECTIVE });
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

module.exports = {
    name: 'messageCreate',
};

module.exports.run = async (message, client, db) => {
    if (message.author.bot || !message?.content) return;
    if (message.content.startsWith(`<@!784109092330799124>`)) return message.reply('Detox is a slash-command Discord bot.\nType `/help` and select Detox to get started!');

    if (!client.guildList.includes(message.guild.id)) return;
    if (message.attachments.size > 0) {
        message.attachments.forEach(async (a) => {
            const [result] = await client.safeSearchDetection(a.proxyURL);
            const detections = result.safeSearchAnnotation;
            console.log(`Adult: ${detections.adult}`);
            console.log(`Spoof: ${detections.spoof}`);
            console.log(`Medical: ${detections.medical}`);
            console.log(`Violence: ${detections.violence}`);
        })
    }
    const result = await perspective.analyze(message.content);
    const obj = JSON.parse(JSON.stringify(result));
    const toxicity = Math.round(obj.attributeScores.TOXICITY.summaryScore.value * 100);
    if (toxicity >= 90) {
        const logChannel = await fetchLogChannel(message.guild.id);
        const lC = client.channels.cache.get(logChannel[0]);
        if (logChannel && lC) {
            await lC.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(7575280)
                        .setTitle('Toxic Message Deleted')
                        .setDescription(`**${message.author.tag}** sent a toxic message in <#${message.channel.id}> which was deleted!\n\nClick below to reveal message sent:\n||${message.content}||`)
                        .setTimestamp()
                ]
            })
        }
        message.author.send(`:warning: Hello <@!${message.author.id}>, you sent a toxic message in **${message.guild.name}** saying ||${message.content}||.\nPlease __refrain from this language__ in the future. If this seems like a mistake, try rephrasing what you said to make it less toxic.`);
        await message.delete();
    }

    if (!message.content.startsWith('>')) return;
    if (!isDev(message)) return;
    const args = message.content.slice('>'.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.devcmds.get(commandName) || client.devcmds.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    return command.run(message, client, args, db, command);
};