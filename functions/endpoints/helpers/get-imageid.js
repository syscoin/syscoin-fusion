const functions = require('firebase-functions')

module.exports = (coin) => {
    const images = functions.config().images
    switch(coin) {
        case 'sys':
            return images.syscoin
        default:
            return null
    }
}