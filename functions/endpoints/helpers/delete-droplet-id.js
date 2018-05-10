const functions = require('firebase-functions')
const axios = require('axios')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (id, cb) => {
    axios({
        method: 'delete',
        url: 'https://api.digitalocean.com/v2/droplets/' + id,
        headers: DOHeader
    }).then(() => {
        cb()
        return console.log('deleted droplet ' + id)
    }).catch((error) => {
        cb(error)
        return console.log(error)
    })
}
