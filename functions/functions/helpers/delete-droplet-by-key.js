const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (vpsKey, cb) => {
    admin.database().ref('/vps/' + vpsKey)
        .once('value', snapshot => {
            const data = snapshot.val()

            axios({
                method: 'delete',
                url: 'https://api.digitalocean.com/v2/droplets/' + data.vpsid,
                headers: DOHeader
            }).then(() => cb()).catch(error => cb(error))
        })
}