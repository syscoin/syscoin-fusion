// @flow
const axios = require('axios')
const { ASSET_API_PROTOCOL, ASSET_API_IP, ASSET_API_PORT } = require('../../config')

const apiUrl = `${ASSET_API_PROTOCOL}://${ASSET_API_IP}:${ASSET_API_PORT}/api`

const parseParams = (obj: Object) => {
    return Object.keys(obj).map(i => {
        if (Array.isArray(obj[i])) {
            return obj[i].map(x => `${i}[]=${x}`).join('&')
        }

        return `${i}=${obj[i]}`
    }).join('&')
}

const getTransactionsForAlias = (obj: Object) => axios.get(`${apiUrl}/assetallocation?${parseParams(obj)}`)
const fetchAssetInfo = (obj: Object) => axios.get(`${apiUrl}/assetrecord/info?${parseParams(obj)}`)

module.exports = {
    getTransactionsForAlias,
    fetchAssetInfo
}
