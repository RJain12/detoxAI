const { footerTxt, footerImg, embedColor, prefix, api } = require('../config.js');
const Discord = require("discord.js");
const { guildExist, getLog } = require('../database/firestore.js')
const { analyze } = require('./analyze.js')

const shardReady = async (client, id) => {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: `detox.ai | d!help`,
      type: 'WATCHING'
    }
  });
}
const guildCreate = async (guild, client, embedColor, footerImg, footerTxt) => {
  const joinMessage = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setAuthor('Nice to meet you!', footerImg)
    .setDescription(`Hello, I was added to your server, **${guild.name}**`)
    .addFields([
      { name: 'Who am I?', value: 'I am a chatbot that uses AI to keep toxic messages out from your Discord server!' },
      { name: 'Get Started!', value: 'Type: `d!setup`' }
    ])
    .setTimestamp()
    .setFooter(footerTxt, footerImg)
  guild.owner.send(joinMessage)
  client.shard.broadcastEval(`this.channels.cache.get('730172463467593770').send('I was just added to **${guild.name}** which has \`${guild.memberCount}\` members.')`);
}

const msg = async (message, client, prefix, util) => {
  try {
    if (message.author.bot) return;
    if (!message.guild) return message.reply('please use commands in a Discord Server.');
    if (await guildExist(message.guild.id)) {
      if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply('I did not recognize that command. Try `d!help`.');
        if (command.dev && !util.isDev(message)) {
          return message.reply('you are not a developer.')
        };
        if (command.admin && !util.isAdmin(message)) {
          return message.reply('you must be an `ADMINISTRATOR` to run this command.')
        }
        if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author}!`;
          if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
          }
          return message.channel.send(reply);
        }
        if (!client.cooldowns.has(command.name)) {
          client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait \`${timeLeft.toFixed(1)}s\` before using the \`${command.name}\` command again.`);
          }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        command.run(client, message, args);
        return;
      } else {
        let toxic = await analyze(message.content);
        if (toxic) {
          const toxicEmbed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setAuthor('Toxicity Detected! Message Deleted.', footerImg)
            .setDescription(`Here is what ${message.author.tag} (<@${message.author.id}>) sent: \`${message.content}\`.`)
            .addFields(
              { name: 'Mistake?', value: 'https://bit.ly/36RfwIl' }
            )
          message.author.send(toxicEmbed)
          message.author.send(`Please always remain kind & considerate in ${message.guild.name}.`)
          message.delete()
          let chanchan = await getLog(message.guild.id);
          if (chanchan !== 'none') {
            chanchan = client.channels.cache.get(chanchan);
            chanchan.send(toxicEmbed);
          }
          return;
        };
        return;
      }
    } else {
      if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName)
          || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply('I did not recognize that command. Try `d!help`.');
        if (command.dev && !util.isDev(message)) {
          return message.reply('you are not a developer.')
        };
        if (command.admin && !util.isAdmin(message)) {
          return message.reply('you must be an `ADMINISTRATOR` to run this command.')
        }
        if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author}!`;
          if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
          }
          return message.channel.send(reply);
        }
        if (!client.cooldowns.has(command.name)) {
          client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait \`${timeLeft.toFixed(1)}s\` before using the \`${command.name}\` command again.`);
          }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        command.run(client, message, args);
        return;
      }
    }
  } catch (e) {
    return;
  }
}
module.exports = { shardReady, msg, guildCreate };
