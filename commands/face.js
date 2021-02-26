module.exports = {
    name: 'face',
    description: 'Get face info.'
};

const { embedColor, footerImg } = require('../config.js');
const vision = require('@google-cloud/vision');
const Client = new vision.ImageAnnotatorClient();
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    try {
        if (message.attachments.size < 1) return message.reply('You must supply an image to classify!')
        const [result] = await Client.faceDetection(message.attachments.first().proxyURL);
        let Embed = new Discord.MessageEmbed()
        const faces = result.faceAnnotations;
        faces.forEach((face, i) => {
            Embed.setAuthor(`Face #${i + 1}:`)
            Embed.setDescription(`Happy: \`${face.joyLikelihood}\`\nAnger: \`${face.angerLikelihood}\`\nSorrow: \`${face.sorrowLikelihood}\`\nSurprise: \`${face.surpriseLikelihood}\``);
            Embed.setThumbnail(message.attachments.first().proxyURL)
            message.channel.send(Embed)
        });
    } catch (e) {
        message.reply(`I'm not sure what that message meant.`)
        console.log(e)
    }
};