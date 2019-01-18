const admin = require('firebase-admin')
const upgradeAwsNode = require('./aws/upgrade')

module.exports = (obj) => new Promise(async (resolve, reject) => {
    const { nodeType, dropletId } = obj
    let data
    let vpsData
    let vpsKey
    let vpsPromise

    try {
        vpsPromise = await admin.database().ref('/vps')
            .orderByChild('vpsid')
            .equalTo(dropletId)
            .once('value')
        vpsKey = Object.keys(vpsPromise.val())[0]
        vpsData = vpsPromise.val()[vpsKey]
    } catch(err) {
        return reject(err)
    }

    try {
        data = await upgradeAwsNode({
            instanceId: vpsData.vpsid,
            allocationId: vpsData.allocationId
        })
    } catch(err) {
        return reject(err)
    }

    try {
        await admin.database().ref('/vps/' + vpsKey).update({
            vpsId: data.InstanceId,
            allocationId: data.AllocationId
        })
    } catch(err) {
        return reject(err)
    }

    return resolve()
})
