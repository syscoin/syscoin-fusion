/**
 * @api {get} /droplets/get-mn-data Get MN data
 * @apiDescription Goes through API filter - Returns all MN data so the droplet can check if it has the correct config. If not, will reconfigure and restart.
 * @apiGroup Droplets Endpoints
 * 
 * @apiSuccessExample {json} Success
 *  {
        mnIndex: String,
        mnKey: String,
        mnName: String,
        mnTxid: String,
        ip: String,
        mnRewardAddress: String,
        nodeType: String
    }
 */
module.exports = (req, res, next) => {
    return res.send({
        mnIndex: req.mnData.mnIndex,
        mnKey: req.mnData.mnKey,
        mnName: req.mnData.mnName,
        mnTxid: req.mnData.mnTxid,
        ip: req.vpsData.ip,
        mnRewardAddress: req.mnData.mnRewardAddress || '',
        nodeType: req.mnData.nodeType,
        vpsImageId: req.vpsData.imageId,
        vpsid: req.vpsData.vpsid,
        vpsKey: req.vpsId
    })
}
