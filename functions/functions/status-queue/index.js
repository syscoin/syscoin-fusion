const queue = require('queue')
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const q = new queue()
q.autostart = true

const getUpdatableVps = require('../helpers/get-updatable-vps')
const getSshKeys = require('../helpers/get-ssh-data')
const getMnStatus = require('../helpers/get-vps-status')
const saveMnStatus = require('../helpers/save-vps-status')

module.exports = functions.pubsub.topic('status').onPublish(event => {
    getUpdatableVps((err, vps) => {
        if (err) {
            console.log(err)
            return err
        }

        if (!vps.length) {
            console.log('Nothing to update!')
            return true
        }

        getSshKeys(vps, (err, vps) => {
            if (err) {
                console.log(err)
                return err
            }

            vps.forEach(i => {
                q.push(cb => {
                    console.log('Running get status for vps ip: ' + i.ip)
                    getMnStatus({
                        ip: i.ip,
                        encryptedSsh: i.mnKeys.sshkey,
                        typeLength: i.mnKeys.typeLength
                    }, (error, data) => {
                        if (error) {
                            console.log(error.toString())
                        }

                        const saveMnData = {
                            vpsId: i.vpsKey,
                        }

                        if (error) {
                            saveMnData.status = error.toString()
                        } else {
                            saveMnData.status = data.status
                        }

                        saveMnStatus(saveMnData, error => {
                            if (error) {
                                return cb()
                            }

                            return cb()
                        })
                    })
                })
            })
        })
    })
})
