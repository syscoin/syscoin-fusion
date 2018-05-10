const axios = require('axios')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (cb) => {
    axios({
        method: 'get',
        headers: DOHeader,
        url: 'https://api.digitalocean.com/v2/droplets?tag_name=web'
    }).then(response => cb(null, response.data.droplets.map(i => i.networks.v4[0].ip_address))).catch(err => cb(err))
}
