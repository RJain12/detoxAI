const { ShardingManager } = require('discord.js');
const Statcord = require('statcord.js');
require('dotenv').config()

const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();

const statcord = new Statcord.ShardingClient({
	key: statcord_key,
	totalShards: 'auto',
	manager,
});

statcord.on('autopost-start', () => {
	console.log('Started Statcord Autopost!');
});

statcord.on('post', (status) => {
	if (!status) console.log('Successful post');
	else console.error(status);
});