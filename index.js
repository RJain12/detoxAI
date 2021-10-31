const { ShardingManager } = require('discord.js');
const Statcord = require('statcord.js');
require('dotenv').config();

// Use TF node backend - binds to TensorFlow C++
require('@tensorflow/tfjs-node');

const manager = new ShardingManager('./bot.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();

const statcord = new Statcord.ShardingClient({
	key: process.env.STATCORD,
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