const AWS = require('./init')
const functions = require('firebase-functions')

module.exports = nodeType => new Promise(async (resolve, reject) => {
    const ec2 = new AWS.EC2()
    const config = functions.config()
    let instance

    const params = {
        ImageId: config.images[nodeType],
        InstanceType: 't3.nano',
        MinCount: 1,
        MaxCount: 1,
        SecurityGroups: [config.aws.security_group],
        KeyName: config.aws.ssh_key
    }

    try {
        instance = await ec2.runInstances(params).promise()
    } catch (err) {
        return reject(err)
    }

    setTimeout(() => resolve(instance), 10000)

})