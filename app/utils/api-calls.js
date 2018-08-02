// @flow
const axios = require('axios')
const { ASSET_API_PROTOCOL, ASSET_API_IP, ASSET_API_PORT } = require('../../config')

const apiUrl = `${ASSET_API_PROTOCOL}://${ASSET_API_IP}:${ASSET_API_PORT}/api`

const getTransactionsForAlias = (alias: string) => axios.get(`${apiUrl}/assetallocation?alias=${alias}`)

module.exports = {
    getTransactionsForAlias
}
