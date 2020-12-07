const { deleteData } = require('../database/firestore.js')

module.exports = {
	name: 'deletemydata',
	description: 'Deletes the guild from the database.',
	cooldown: 3,
  admin: true
};

module.exports.run = async (client, message, args) => {
  if(await deleteData(message.guild.id)) {
    message.reply('This guild has been wiped from my database. You can now run `d!setup` again.');
    return;
  } else{
    message.reply('Data deletion was unsuccessful! Visit my support server by doing `d!help`.')
  }
}