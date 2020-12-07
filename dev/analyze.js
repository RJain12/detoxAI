const { embedColor, footerImg } = require('../config.js');
const { api } = require('../config.js');
const Perspective = require('perspective-api-client');
const perspective = new Perspective({ apiKey: api });

const analyze = async (content) => {
  try {
    const result = await perspective.analyze(content);
    let obj = JSON.parse(JSON.stringify(result));
    let toxicity = Math.round(obj.attributeScores.TOXICITY.summaryScore.value*100);
    if (toxicity > 90) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return;
  }
}

module.exports = { analyze };