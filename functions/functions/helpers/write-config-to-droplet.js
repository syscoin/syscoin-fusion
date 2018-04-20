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

    console.log('Changing config for ' + ip)

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
            const conf = makeConfig(mnKey, ip)

            conn.on('ready', () => {

                conn.exec('rm ./.syscoincore/syscoin.conf && echo "' + conf + '" > ./.syscoincore/syscoin.conf', (err, stream) => {
                    if (err) {
                        return cb(err)
                    }

                    stream.on('data', () => {
                    }).on('close', () => {
                        
                        conn.exec('sudo shutdown -r 1', () => {
                            // Ends the SSH connection
                            conn.end()
                            console.log('restarting in 1 minute...')

                            //destroyTempKey(sshData.sshKeyName) Looks like firebase automatically cleans /tmp
                            return cb(null, sshData)
                        })
                    }).stderr.on('data', () => {
                        return cb(true)
                    })
                });

            }).connect({
                host: ip,
                port: 22,
                username: 'root',
                privateKey: fs.readFileSync(sshData.keyPath)
            })
        }
    ], (err) => {
        if (err) {
            return cb(err)
        }
        return cb(null)
    })
}