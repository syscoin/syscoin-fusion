const admin = require('firebase-admin')
const terminateInstance = require('./terminate-instance')
const detachIp = require('./detach-ip')

module.exports = (instanceId, allocationId) => new Promise(async (resolve, reject) => {
    let vps, vpsKey

    try {
        await terminateInstance(instanceId)
    } catch(err) {
        return reject(err)
    }

    try {
        await detachIp(allocationId)
    } catch(err) {
        return reject(err)
    }

    try {
        vps = await admin
            .database()
            .ref('/vps')
            .orderByChild('vpsId')
            .equalTo(instanceId)
            .once('value')
        vps = vps.val()
        
        vpsKey = Object.keys(vps)[0]

        await admin.database().ref('/orders/' + vps.orderId).remove()
        await admin.database().ref('/mn-data/' + vps.mnData).remove()
        await admin.database().ref('/vps/' + vpsKey).remove()
    } catch(err) {
        return reject(err)
    }

    return resolve()
})
