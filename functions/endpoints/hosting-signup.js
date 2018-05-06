const firebase = require('firebase-functions')

module.exports = (req, res, next) => {
    firebase.database().ref('/signup').push(req.body.email)

    return res.status(200).send()
}
