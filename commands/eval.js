const { inspect } = require('util');

module.exports = {
	name: 'eval',
	description: 'evaluate things',
	dev: true,
};
module.exports.run = async (client, message, args) => {
	try {
		const toEval = args.join(' ');
		const hrStart = process.hrtime();
		const evaluated = inspect(await Promise.resolve(eval(toEval, { depth: 0 })));
		if (toEval) {
			const hrDiff = process.hrtime(hrStart);
			return message.channel.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`javascript\n${evaluated}\n\`\`\``, { maxLength: 1900 });
		}
		else {
			message.channel.send('Error whilst evaluating: `cannot evaluated air`');
		}
	}
	catch (e) {
		message.channel.send(`Error whilst evaluating: \`${e.message}\``);
	}
};