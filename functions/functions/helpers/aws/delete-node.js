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

    return resolve()
})
