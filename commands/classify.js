module.exports = {
    name: 'classify',
    description: 'Classify an image.'
};

const { embedColor, footerImg } = require('../config.js');
const vision = require('@google-cloud/vision');
const Client = new vision.ImageAnnotatorClient();
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    try {
        if (message.attachments.size < 1) return message.reply('You must supply an image to classify!')
        const [result] = await Client.labelDetection(message.attachments.first().proxyURL);
        const labels = result.labelAnnotations;
        let description = "This image contains: ```";
        labels.forEach(label => description += (label.description + "\n")); 
        const embed = new Discord.MessageEmbed()
            .setAuthor('Classified Image')
            .setThumbnail(message.attachments.first().proxyURL)
            .setDescription(description + "```")
        message.channel.send(embed)
    } catch (e) {
        message.reply(`I'm not sure what that message meant.`)
        console.log(e)
    }
};