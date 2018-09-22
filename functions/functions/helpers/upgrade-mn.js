const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}

module.exports = (obj, cb) => {
    const { dropletId } = obj
    const imageId = functions.config().images.sys

    axios({
        method: 'post',
        url: 'https://api.digitalocean.com/v2/droplets/' + dropletId + '/actions',
        data: {
            type: 'rebuild',
            image: imageId
        },
        headers: DOHeader
    }).then((response) => {
        return cb(null, {
            status: 'Masternode is updating.',
            configFile: 'Masternode is updating.'
        })
    }).catch((error) => {
        return cb(error)
    })
}
