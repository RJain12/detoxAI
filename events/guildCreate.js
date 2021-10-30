module.exports = {
	name: 'guildCreate',
};

module.exports.run = async (guild, client) => {
	try {
		client.shard.broadcastEval((localclient, id) => {
			const channel = localclient.channels.cache.get('843261412796530718');
			if (channel) {
				return channel.send({ embeds: [{
					color: 9878783,
					title: 'Joined a New Guild',
					description: `**Guild Name:** \`${id.name}\`\n**Guild ID:** \`${id.id}\`\n**Member Count:** \`${id.memberCount}\`\n**Timestamp:** <t:${Math.floor(new Date() / 1000)}:f>`,
					timestamp: new Date(),
				}] });
			}
		}, { context: guild });
	}
	catch (error) {
		console.log(`Error on guildCreate: ${error}`);
	}
};