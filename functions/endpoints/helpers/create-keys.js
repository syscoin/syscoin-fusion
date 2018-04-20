const keypair = require('keypair')
const aes256 = require('aes256')
const forge = require('node-forge')

const generatePwd = require('./generate-random-pwd')

module.exports = () => {
    const result = {}
    const keys = keypair()
    const encKey = generatePwd()

    const publicKey = forge.pki.publicKeyFromPem(keys.public)
    const ssh = forge.ssh.publicKeyToOpenSSH(publicKey, encKey.substr(0,4) + '@thrifa.io')

    keys.public = ssh

    result.keys = keys
    
    result.priv = {}
    result.priv.enc = encKey + aes256.encrypt(encKey, keys.private)
    result.priv.typeLength = encKey.length

    return result
}