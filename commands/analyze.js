module.exports = {
  name: 'analyze',
  description: 'analyze toxicity in a message',
  dev: true,
};

const { api } = require('../config.js');
const Perspective = require('perspective-api-client');

module.exports.run = async (client, message, args) => {
  try {
    const text = String(message.content).slice(10,message.content.length);
    const perspective = new Perspective({ apiKey: api });
    const result = await perspective.analyze(text);
    const jsonResult = JSON.stringify(result, null, 2);
    let obj = JSON.parse(jsonResult)

  } catch(e){
    message.reply(`Error: ${e}`)
  }
}