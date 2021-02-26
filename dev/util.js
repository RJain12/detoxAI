const devs = ['220275834672381954', '286737962769580032', '220625168228286464'];
function isDev(message) {
	return devs.includes(message.author.id);
}

function isAdmin(message) {
  if (!message.member.hasPermission(`ADMINISTRATOR`, { checkAdmin: true, checkOwner: true})) {
    return false
  } else {
    return true
  }
}

module.exports = { isDev, isAdmin };