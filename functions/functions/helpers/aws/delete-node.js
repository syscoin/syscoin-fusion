const AWS = require('./init')
const terminateInstance = require('./terminate-instance')
const detachIp = require('./detach-ip')

module.exports = (instanceId, allocationId) => new Promise(async (resolve, reject) => {
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
