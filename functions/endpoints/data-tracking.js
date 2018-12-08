const admin = require('firebase-admin')

module.exports = (req, res, next) => {
    const {tag} = req.body;

    if (!isTagValid(tag)) {
        return res.status(422).json({
            error: true,
            message: 'invalid tag value'
        })
    }

    admin.database().ref('/data-tracking')
        .once('value', snapshot => {
            let collectionObj = snapshot.val() || {}
            if (!collectionObj[tag]) {
                collectionObj[tag] = 1;
                writeToDataTracking(collectionObj)
            } else {
                let currentValue = collectionObj[tag]
                collectionObj[tag] = currentValue + 1;
                writeToDataTracking(collectionObj)
            }
        }).catch(() => res.status(500).send({
        error: true,
        message: 'Internal Server Error.'
    }))

    function isTagValid(tag) {
        const regex = /^[A-Za-z]+$/

        if (tag && !tag.match(regex)) {
            return false;
        }

        if (!tag) {
            return false;
        }

        if (tag === '') {
            return false;
        }

        return true;
    }

    function writeToDataTracking(dataObj) {
        admin.database().ref('/data-tracking').set(dataObj, function (error) {
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
}

