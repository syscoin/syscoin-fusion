const admin = require('firebase-admin')
const functions = require('firebase-functions')
const async = require('async')

const getUpdatableVps = require('../helpers/get-updatable-vps')
const getSshKeys = require('../helpers/get-ssh-data')
const getMnStatus = require('../helpers/get-vps-status')
const saveMnStatus = require('../helpers/save-vps-status')
const upgradeMn = require('../helpers/upgrade-mn')

module.exports = functions.pubsub.topic('status').onPublish(event => {
    return new Promise((resolve, reject) => {
        getUpdatableVps((err, vps) => {
            if (err) {
                console.log(err)
                reject(err)
                return err
            }
    
            if (!vps.length) {
                console.log('Nothing to update!')
                resolve()
                return true
            }
    
            getSshKeys(vps, (err, vps) => {
                if (err) {
                    console.log(err)
                    reject(err)
                    return err
                }

                async.eachLimit(vps, 10, (i, cb) => {
                    console.log('Running get status for vps ip: ' + i.ip)

                    admin.database().ref('/mn-data')
                                .orderByChild('vpsId')
                                .equalTo(i.vpsKey)
                                .on('value', snapshot => {
                                    const snap = snapshot.val()
                                    const key = Object.keys(snap)[0]
                                    const imageId = functions.config().dropletconfig.imageid

                                    if (imageId !== i.imageId && i.ip === '174.138.9.224') {
                                        upgradeMn({
                                            dropletId: i.vpsid
                                        }, (err, data) => {
                                            if (err) {
                                                return cb(err)
                                            }

                                            const saveMnData = {
                                                vpsId: i.vpsKey,
                                                status: data.status,
                                                configFile: data.configFile,
                                                imageId
                                            }

                                            saveMnStatus(saveMnData, (err) => {
                                                if (err) {
                                                    return cb(err)
                                                }

                                                return cb()
                                            })
                                        })
                                    } else {
                                        getMnStatus({
                                            ip: i.ip,
                                            encryptedSsh: i.mnKeys.sshkey,
                                            typeLength: i.mnKeys.typeLength,
                                            mnKey: snap[key].mnKey
                                        }, (error, data) => {
                                            if ((typeof error) === 'boolean') {
                                                console.log('Cant connect to ' + i.ip)
                                                return cb(true)
                                            }
                    
                                            const saveMnData = {
                                                vpsId: i.vpsKey,
                                            }
                    
                                            if (error) {
                                                saveMnData.status = error.toString()
                                            } else {
                    
                                                if (typeof data.mnStatus === 'string') {
                                                    saveMnData.status = data.mnStatus
                                                } else if (data.reboot) {
                                                    saveMnData.status = 'Invalid configuration detected. Restarting...'
                                                } else {
                                                    saveMnData.status = data.mnStatus.status
                                                }
                    
                                                saveMnData.configFile = data.configFile
                                            }
                    
                                            saveMnStatus(saveMnData, error => {
                                                if (error) {
                                                    return cb(error)
                                                }
                    
                                                return cb()
                                            })
                                        })
                                    }

                                })

                }, (err) => {
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }

                    console.log('Finished.')

                    return resolve()
                })
            })
        })
    })
    
})
