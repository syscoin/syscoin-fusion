const fs = require('fs')

module.exports = (name, cb) => {
    fs.unlink('/temp/' + name, (error) => {
        if (error) {
            throw error
        }

        if (cb) {
            return cb()
        }
    })
}
