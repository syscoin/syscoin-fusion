const functions = require('firebase-functions')
const axios = require('axios')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (id) => {
    axios({
        method: 'delete',
        url: 'https://api.digitalocean.com/v2/droplets/' + id,
        headers: DOHeader
    }).then(() => {
        return console.log('deleted droplet ' + id)
    }).catch((error) => {
        return console.log(error)
    })
}
