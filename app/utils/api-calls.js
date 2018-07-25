const axios = require('axios')

const getTransactionsForAlias = alias => {
    // const apiUrl = `${process.env.ASSET_API_URL}:${process.env.ASSET_API_PORT}/api`
    const apiUrl = `http://127.0.0.1:8080/api`
    return axios.get(`${apiUrl}/assetallocation?alias=${alias}`)
}

module.exports = {
    getTransactionsForAlias
}
