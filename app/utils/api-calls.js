const axios = require('axios')

const getTransactionsForAlias = alias => {
    const apiUrl = `${process.env.ASSET_API_URL}:${process.env.ASSET_API_PORT}/api`
    return axios.get(`${apiUrl}/assetallocation?alias=${alias}`)
}

module.exports = {
    getTransactionsForAlias
}
