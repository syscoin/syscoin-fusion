const fs = require('fs')
const async = require('async')
const Client = require('ssh2').Client

const destroyTempKey = require('./destroy-temp-key')
const makeConfig = require('./make-config')
const decrypt = require('./decrypt')
const generateRandomString = require('../../endpoints/helpers/generate-random-pwd')

module.exports = (obj, cb) => {
    const {ip, encryptedSsh, typeLength, mnKey} = obj
    const conn = new Client()

    async.waterfall([
        cb => {
            const sshKey = decrypt(typeLength, encryptedSsh)
            const sshKeyName = generateRandomString() + '.pem'

            fs.appendFile('/tmp/' + sshKeyName, sshKey, (error) => {
                if (error) {
                    return cb(error)
                }

                const keyPath = '/tmp/' + sshKeyName

                return cb(null, {
                    sshKey,
                    sshKeyName,
                    keyPath
                })
            })
        },
        (sshData, cb) => {
            conn.on('ready', () => {

                async.parallel([
                    cb => {
                        conn.exec('./syscoin/src/syscoin-cli masternode status', (err, stream) => {
                            if (err) {
                                return cb(err)
                            }

                            stream.on('data', data => {

                                cb(null, JSON.parse(data.toString()))

                            }).stderr.on('data', err => {

                                cb(null, err.toString())

                            })

                        })
                    },
                    cb => {

                        conn.exec('cat .syscoincore/syscoin.conf', (err, stream) => {
                            if (err) {
                                return cb(err)
                            }

                            stream.on('data', data => {
                                const text = data.toString()

                                if (text.indexOf('masternodeprivkey') === -1) {
                                    conn.exec('rm ./.syscoincore/syscoin.conf && echo "' + makeConfig(mnKey, ip) + '" > ./.syscoincore/syscoin.conf && sudo shutdown -r 1 && cat .syscoincore/syscoin.conf', (err, stream) => {
                                        if (err) {
                                            console.log(err.toString())
                                        }

                                        stream.on('data', data => {
                                            if (data.toString().indexOf('masternodeprivkey') !== -1) {
                                                console.log(data.toString())
                                                return cb(null, data.toString())
                                            }
                                        }).stderr.on('data', error => {
                                            return cb(null, error.toString())
                                        })
                                    })
                                } else {
                                    return cb(null, data.toString())
                                }

                            }).stderr.on('data', error => {
                                cb(null, error.toString())
                            })
                        })

                    }
                ], (error, results) => {
                    if (error) {
                        return cb(error)
                    }
                    conn.end()

                    return cb(null, {
                        mnStatus: results[0],
                        configFile: results[1]
                    })
                })
            }).on('error', (err) => {
                console.log(err)
                return cb(true)
            }).connect({
                host: ip,
                port: 22,
                username: 'root',
                privateKey: fs.readFileSync(sshData.keyPath)
            })
        }
    ], (err, data) => {
        if (err) {
            return cb(err)
        }

        return cb(null, data)
    })
}