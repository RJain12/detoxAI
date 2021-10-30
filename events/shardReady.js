module.exports = {
	name: 'shardReady',
};

module.exports.run = (id) => console.log(`=== SHARD ${id} READY ===`);