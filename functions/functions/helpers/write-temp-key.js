const fs = require('fs')

module.exports = (data, name) => {
    fs.writeFile('./temp/id_rsa.pem', data, (err) =>{
        if (err) {
            return console.log(err)
        }
    })
}
