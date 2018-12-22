const AWS = require('./init')

module.exports = instanceId => new Promise(async (resolve, reject) => {
    const ec2 = new AWS.EC2()
    let instance

    const params = {
        InstanceIds: [
            instanceId
        ]
    }

    try {
        instance = await ec2.describeInstances(params).promise()
    } catch(err) {
        return reject(err)
    }

    return resolve(instance.Reservations[0].Instances[0].PublicIpAddress)
})
