const admin = require('firebase-admin')
const upgradeAwsNode = require('./aws/upgrade')

module.exports = (obj) => new Promise(async (resolve, reject) => {
    const { nodeType, dropletId } = obj
    let data
    let vpsData
    let vpsKey

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
            InstanceId: vpsData.InstanceId,
            AllocationId: vpsData.AllocationId
        })
    } catch(err) {
        return reject(err)
    }

    try {
        await data.database().ref('/vps/' + vpsKey).update(data)
    } catch(err) {
        return reject(err)
    }

    return resolve()
})
