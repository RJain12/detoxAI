const { guildExist, setupGuild } = require('../database/firestore.js')

module.exports = {
  name: 'setup',
  description: 'Setup my detox AI auto-mod!',
  cooldown: 3,
  admin: true
};

module.exports.run = async (client, message, args) => {
  try {
    if (await guildExist(message.guild.id)) { message.reply('This Discord Server has already been setup. If you would like to delete your server from my database, use `d!deletemydata`.'); return; }
    message.channel.send('Welcome to **detox.ai**!\n I am a Discord robot, powered by artificial-intelligence.\n I automatically delete toxic/harassing messages from your server.\n\n> Click the `✅` emoji below to start the setup.').then(m => {
      m.react('✅');
      const filter = (reaction, user) => {
        return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
      };
      m.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
        .then(async () => {
          message.channel.send('\nPlease tag a channel where I can send logs. When I find and detect a toxic message, I will delete it, and send a log message. \n> If you do not want me to send message logs, type `no`.').then(m2 => {
            m.channel.awaitMessages(ma => ma.author.id === message.author.id, { max: 1, time: 45000, errors: ['time'] })
              .then(async(collected) => {
                if (collected.first().content.toLowerCase() == 'no') {
                  m2.delete()
                  m.channel.send('**__Setup is complete!__**\n\nI will now use AI to detect and delete toxic messages. Users will be messaged if they are found to be toxic.');
                  await setupGuild(message.guild.id,'none')
                  return;
                }
                let channel = collected.first().mentions.channels.first();
                await setupGuild(message.guild.id,channel.id);
                m.channel.send('**__Setup is complete!__**\n\nI will now use AI to detect and delete toxic messages. Users will be messaged if they are found to be toxic.');
              })
          })
        })
    })
  } catch {
    message.channel.send('It looks like setup timed out, or I do not have proper permissions to work. Make sure that I have `ADMINISTRATOR` permissions in this Discord Server. Use `d!setup` to try again.')
  }
}