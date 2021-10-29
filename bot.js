const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


client.on('interactionCreate', interaction => {
    
});

client.login(process.env.TOKEN);