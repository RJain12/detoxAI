const googleIt = require('google-it')

const dict = {
	"ⱨ": "h",
	"а": "a",
	"е": "e",
	"і": "i",
	"о": "o",
	"ѡ": "w",
	"г": "r",
	"с": "c",
	"т": "t",
	"ѵ": "v",
	"Ď": "D",
	"н": "H",
	"Ś": "S",
	"п": "n",
	"к": "k",
	"Ϗ": "K",
	"Ά": "A",
	"Ń": "N",
	"Ŵ": "W",
	"Ь": "b",
	"Ļ": "L",
	"℟": "R",
	"М": "M",
	"р": "p",
	"Р": "P",
	"Ɠ": "G",
	"Е": "E",
	"у": "y",
	"С": "C",
	"Т": "T"
}

module.exports = {
    name: 'supersecret',
    description: 'be pog.'
};

module.exports.run = async (client, message, args) => {
	let content = args.join(' ');
	content.split('').forEach(letter => {
		if (letter in dict) {
			content = content.replace(letter, dict[letter])
		}
	});
	content = content.replace(/[^\w\s]/gi, '')
	googleIt({ 'query': content }).then(results => {
		const channel = message.guild.channels.cache.get('827609301807923210');
		channel.send({embed: {
			title: content,
			url: `https://www.google.com/search?q=${content.split(' ').join('+')}`
		}})
		channel.send(`**Answer:** ${results[0].title}\n\`\`\`${results[0].snippet}\`\`\`\ Click here to go to trivia: <#822538839984832603>`)
	}).catch(e => {
	})
}