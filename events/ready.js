const fs = require('fs');

module.exports = {
	name: 'ready',
	once: true,
};

module.exports.run = (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
};