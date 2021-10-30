const devs = ['286737962769580032']
const db = require('firebase-admin');
const ref = db.firestore().collection('guilds')

module.exports.clean = (text) => {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
};

module.exports.chunkSubstr = (str, size) => {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);
	for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
	  chunks[i] = str.substr(o, size)
	};
	return chunks;
};

module.exports.fetchLogChannel = async (guildId) => {
    const data = await ref.doc(guildId).get();
    return data.exists ? data.data().logChannel : false;
}

module.exports.isDev = (message) => devs.includes(message.author.id);