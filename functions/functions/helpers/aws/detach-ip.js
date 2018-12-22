const AWS = require('./init')

module.exports = allocationId => new Promise(async (resolve, reject) => {
    const ec2 = new AWS.EC2()

    const releaseParams = {
        AllocationId: allocationId
    }

    ec2.releaseAddress(releaseParams, err => {
        if (err) {
            return reject(err)
        }

        return resolve()
    })
})
