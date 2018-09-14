const admin = require('firebase-admin')

module.exports = (req, res, next) => {
    const {
        tag
    } = req.body

    if (!tag) {
        return res.status(422).json({
            error: true,
            message: 'Lacking required parameters.'
        })
    }

    if(tag === ''){
        return res.status(422).json({
            error: true,
            message: 'tags required.'
        })
    }

    admin.database().ref('/data-tracking').set({
        tag: tag
    }, function(error) {
        if (error) {
            res.status(500).json({
                error: true,
                message: 'Internal server error' + error
            })
        } else {
            res.status(200).json({
                error: false,
                message: 'successfully saved'
            })
        }
    });
}

