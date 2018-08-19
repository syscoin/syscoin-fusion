const admin = require('firebase-admin')

/**
 * @api {post} /edit-node Edit node
 * @apiDescription Needs firebase authentication - You need to send ALL these fields, even if you want to edit only one
 * @apiGroup Endpoints
 * 
 * @apiParam {String} mnIndex new MN index
 * @apiParam {String} mnKey new MN key
 * @apiParam {String} mnName new MN name
 * @apiParam {String} mnTxid new MN txid
 * @apiParam {String} id mn-data DB id
 * 
 * @apiSuccessExample {json} Success
 *  {
        error: false
    }
 */
module.exports = (req, res, next) => {
    const {
        mnIndex,
        mnKey,
        mnName,
        mnTxid,
        id
    } = req.body

    if (!(mnIndex && mnKey && mnName && mnTxid && id)) {
        return res.status(422).json({
            error: true,
            message: 'Lacking required parameters.'
        })
    }

    admin.database().ref('/mn-data')
        .orderByChild('userId')
        .equalTo(req.user.uid)
        .once('value', snapshot => {
            const data = snapshot.val()

            if (snapshot.hasChildren() && !data[id]) {
                return res.status(404).send({
                    error: true,
                    message: 'You are not allowed to do that'
                })
            } else if (!snapshot.hasChildren()) {
                return res.status(404).send({
                    error: true,
                    message: 'You are not allowed to do that'
                })
            }

            admin.database().ref('/mn-data/' + id).update({
                mnIndex,
                mnKey,
                mnName,
                mnTxid
            }).then(() => res.json({
                error: false
            })).catch(() => res.status(500).json({
                error: 500,
                message: 'Internal server error'
            }))
        })
}
