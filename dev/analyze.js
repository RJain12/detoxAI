const { embedColor, footerImg } = require('../config.js');
const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: process.env.API });

const analyze = async (content) => {
  try {
    const result = await perspective.analyze(content);
    let obj = JSON.parse(JSON.stringify(result));
    let toxicity = Math.ceil(obj.attributeScores.TOXICITY.summaryScore.value*100);
    if (toxicity > 88) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return;
  }
}

module.exports = { analyze };