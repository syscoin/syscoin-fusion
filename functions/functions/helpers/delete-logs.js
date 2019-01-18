const admin = require('firebase-admin')

module.exports = obj => new Promise(async (resolve, reject) => {
    try {
        await admin.database().ref('/orders/' + obj.orderId).remove()
        await admin.database().ref('/mn-data/' + obj.mnDataId).remove()
        await admin.database().ref('/vps/' + obj.vpsId).remove()
    } catch(err) {
        return reject(err)
    }

    return resolve()
})
