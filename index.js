const config = require('./config.js');

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', {
    execArgv: ['--trace-warnings', '--trace-uncaught'],
    shardArgs: ['--ansi', '--color'],
    token: config.token
});

manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));