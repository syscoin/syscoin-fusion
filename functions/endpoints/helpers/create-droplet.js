const admin = require('firebase-admin')
const functions = require('firebase-functions')
const axios = require('axios')
const async = require('async')
const randomKey = require('./generate-random-pwd')

const createKeys = require('./create-keys')

const DOHeader = {
    'Authorization': 'Bearer ' + functions.config().keys.digitalocean
}
const doRegions = [
    'sgp1',
    'lon1',
    'nyc3',
    'ams3',
    'fra1',
    'tor1',
    'sfo2',
    'blr1'
]

module.exports = (cb) => {
    // Creates new SSH RSA key
    const keys = createKeys()

    async.waterfall([
        (cb) => {
            // Generates and add new keys to the account
            axios({
                method: 'post',
                url: 'https://api.digitalocean.com/v2/account/keys',
                data: {
                    name: randomKey(),
                    public_key: keys.keys.public
                },
                headers: DOHeader
            }).then((response) => {
                return cb(null, {
                    keys,
                    newAccKey: response.data
                })
            }).catch((error) => {
                return cb(error)
            })
        },
        (keys, cb) => {
            // Creates the droplet and appends new key to it.
            axios({
                method: 'post',
                url: 'https://api.digitalocean.com/v2/droplets',
                data: {
                    'name': 'massive-t-poo',
                    'region': 'sfo2'/*doRegions[Math.floor(Math.random() * 7) + 0]*/,
                    'size': 's-1vcpu-2gb',
                    'image': functions.config().dropletconfig.imageid,
                    'ssh_keys': [keys.newAccKey.ssh_key.id],
                    'backups': false,
                    'ipv6': true,
                    'user_data': null,
                    'private_networking': null,
                    'volumes': null,
                    'tags': [
                        'web'
                    ]
                },
                headers: DOHeader
            }).then((response) => {
                return cb(null, {
                    keys,
                    droplet: response.data
                })
            }).catch((error) => {
                return cb(error)
            })
        }
    ], (err, data) => {
        if (err) {
            return cb(err)
        }

        return cb(null, data)
    })
}
