const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

async function detectText(fileName) {
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    return detections[0].description

}

module.exports = {
    name: 'ocr',
    description: 'OCR read an image.'
};

const Discord = require('discord.js')
const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: process.env.API });

module.exports.run = async (client, message, args) => {
    try {
        if (message.attachments.size < 1) return message.reply('You must supply an image to OCR!')
        outText = await detectText(message.attachments.first().proxyURL)
        const result = await perspective.analyze(outText);
        let obj = JSON.parse(JSON.stringify(result));
        let toxic = '`' + String(Math.ceil(obj.attributeScores.TOXICITY.summaryScore.value * 10000) / 100) + '`' || `Error, could not calculate.`;
        const embed = new Discord.MessageEmbed()
            .setAuthor('OCR Image Requested by ' + message.author.tag)
            .setThumbnail(message.attachments.first().proxyURL)
            .setDescription("```" + outText.substring(0, 2000) + "```")
            .addField('Toxicity (%)', toxic)
        message.channel.send(embed)
    } catch (e) {
        message.reply(`I'm not sure what that message meant.`)
        console.log(e)
    }
};