const admin = require('firebase-admin');

const initFirestore = async () => {
	const serviceAccount = require('./firestoreKey.json');
	console.log('Firestore Successfully Initialized');
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

const guildExist = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = await ref.doc(guildID).get();
  return guildRef.exists;
}

const setupGuild = async (guildID, modlogs) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = ref.doc(guildID);
  guildRef.set({ 
    logChannel: modlogs
  }, {merge: true})
  return true
}

const deleteData = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	ref.doc(guildID).delete();
	return true;
}

const getLog = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = await ref.doc(guildID).get();
  return guildRef.data().logChannel;
}

module.exports = { guildExist, setupGuild, initFirestore, deleteData, getLog };
