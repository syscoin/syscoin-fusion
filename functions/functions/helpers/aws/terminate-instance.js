const AWS = require('./init')

module.exports = instanceId => new Promise(async (resolve, reject) => {
    const ec2 = new AWS.EC2()
    const params = {
        InstanceIds: [
            instanceId
        ]
    }

    try {
        await ec2.terminateInstances(params).promise()
    } catch(err) {
        return reject(err)
    }

    return resolve()
})
