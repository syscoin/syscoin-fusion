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
                url: 'https://api.digitalocean.com/v2/droplets/' + data.vpsId,
                headers: DOHeader
            }).then(() => {
                cb()
                return console.log('deleted droplet ' + id)
            }).catch((error) => {
                cb(error)
                return console.log(error)
            })
        })
}