const admin = require('firebase-admin')
const async = require('async')

module.exports = cb => {
    try {
        admin.database().ref('/vps')
                        .orderByChild('lock')
                        .equalTo(false)
                        .limitToFirst(5)
                        .once('value', snapshot => {
                            if (!snapshot.hasChildren()) {
                                return cb(null, [])
                            }
                            const snap = snapshot.val()
                            const keys = Object.keys(snap)
                            const results = []
                    
                            keys.forEach(i => {
                                const vps = snap[i]
                                
                                vps.vpsKey = i
                                results.push(vps)
                            })

                            async.each(results, (i, cb) => {
                                admin.database().ref('/vps/' + i.vpsKey).update({
                                    lock: true,
                                    lastUpdate: Date.now()
                                })
                            })
                    
                            cb(null, results)
                        })
    } catch (err) {
        return cb(err)
    }
}
