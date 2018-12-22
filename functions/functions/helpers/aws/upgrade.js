const createInstance = require('./create-instance')
const terminateInstance = require('./terminate-instance')
const associateIp = require('./associate-ip')

module.exports = obj => new Promise(async (resolve, reject) => {
    const { instanceId, allocationId } = obj

    let newInstance,
        newAllocation
    
    try {
        newInstance = await createInstance('sys')
    } catch(err) {
        return reject(err)
    }

    try {
        newAllocation = await associateIp({
            AllocationId: allocationId,
            InstanceId: newInstance.Instances[0].InstanceId
        })
    } catch(err) {
        await terminateInstance(newInstance.Instances[0].InstanceId)
        return reject(err)
    }

    try {
        await terminateInstance(instanceId)
    } catch(err) {
        return reject(err)
    }

    return resolve({
        AllocationId: newAllocation,
        InstanceId: newInstance.Instances[0].InstanceId
    })
})
