module.exports = {
	name: 'shazam',
	description: 'Shazam a song using the sound file!'
};

var axios = require("axios");
const { MessageEmbed } = require('discord.js')

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

var data = {
	'api_token': '55158f93012b5537590a4347cd4afb95',
	'return': 'apple_music',
};

module.exports.run = async (client, message, args) => {
	if (!message.attachments.first()) return message.reply('You must attach a song!')
	if (!String(message.attachments.first().url).includes('.mp3')) return message.reply('You must attach an .mp3 song!')
	let a = await message.channel.send('Shazaming...')
	data['url'] = message.attachments.first().url;
	axios({
		method: 'post',
		url: 'https://api.audd.io/',
		data: data,
		headers: { 'Content-Type': 'multipart/form-data' },
	})
		.then((response) => {
			if (response.data.status !== 'success') return message.reply('Hmm! I could not detect that song. Try a different one!')
			console.log(response.data.result.apple_music)
			const Embed = new MessageEmbed()
				.setURL(response.data.result.apple_music.url)
				.setImage(response.data.result.apple_music.artwork.url)
				.setAuthor('Artist: ' + response.data.result.apple_music.artistName)
				.setTitle(response.data.result.apple_music.name)
				.setDescription(`**Duration**: ${millisToMinutesAndSeconds(response.data.result.apple_music.durationInMillis)}\n**Genre**: ${response.data.result.apple_music.genreNames.join(', ')}\n**Release Date**: ${response.data.result.apple_music.releaseDate}\n**Album Name**: ${response.data.result.apple_music.albumName}`)
				.setFooter('Credits to zyn#0119 for this idea')
			a.edit(`I detected a song:`,Embed);
			return message.channel.send('', {files: [{
				attachment: response.data.result.apple_music.previews[0].url,
				name: `Preview_${response.data.result.apple_music.name}.m4a`}]})
		})
		.catch((error) => {
			message.reply('Oops, please try a different piece of music!')
		});
};