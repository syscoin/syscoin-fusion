const genPwd = require('generate-password')

module.exports = () => genPwd.generate({
    length: Math.floor((Math.random() * 20) + 10),
    numbers: true
})
