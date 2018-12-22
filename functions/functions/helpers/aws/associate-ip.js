const AWS = require('./init')

module.exports = obj => new Promise(async (resolve, reject) => {
    const { AllocationId, InstanceId } = obj
    const ec2 = new AWS.EC2()

    const allocationParams = {
        AllocationId: AllocationId,
        InstanceId: InstanceId
    }
    console.log(allocationParams)

    ec2.associateAddress(allocationParams, (err, data) => {
        if (err) {
            return reject(err)
        }

        return resolve(data.AssociationId)
    })
})
