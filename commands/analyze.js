module.exports = {
    name: 'analyze',
    description: 'analyze toxicity in a message'
};

const { embedColor, footerImg } = require('../config.js');
const { api } = require('../config.js');
const Perspective = require('perspective-api-client');
const Discord = require('discord.js')
const perspective = new Perspective({ apiKey: api });

module.exports.run = async (client, message, args) => {
    try {
        const text = String(message.content).slice(10, message.content.length);
        const result = await perspective.analyze(text);
        let obj = JSON.parse(JSON.stringify(result));
        console.log(JSON.stringify(result));
        const embed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setAuthor('detox.ai - toxicity analyzer', footerImg)
            .setDescription(`Your message had a toxicity level of \`${obj.attributeScores.TOXICITY.summaryScore.value * 100}\`%.`)
        message.channel.send(embed);

    } catch (e) {
        message.reply(`I'm not sure what that message meant.`)
    }
}
