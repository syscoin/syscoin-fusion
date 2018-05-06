const firebase = require('firebase-functions')
const admin = require('firebase-admin')

module.exports = (req, res, next) => {
    admin.database().ref('/signup').push(req.body.email)

    return res.status(200).send()
}
