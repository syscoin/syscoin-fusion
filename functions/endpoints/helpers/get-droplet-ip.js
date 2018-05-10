const functions = require('firebase-functions')
const axios = require('axios')

const DOHeader = {
    Authorization: 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (id, cb) => {
    axios({
        method: 'get',
        url: 'https://api.digitalocean.com/v2/droplets/' + id,
        headers: DOHeader
    }).then((response) => {
        return cb(null, response.data.droplet.networks.v4[0].ip_address)
    }).catch((error) => {
        return cb(error)
    })
}
