const admin = require('firebase-admin')

module.exports = cb => {
    try {
        admin.database().ref('/vps').once('value', snapshot => {
            const snap = snapshot.val()
            const keys = Object.keys(snap)
            const results = []
    
            keys.forEach(i => {
                const vps = snap[i]
                
                //if (vps.lastUpdated < new Date(Date.now() - 1800000).getTime()) {
                    vps.vpsKey = i
                    results.push(vps)
                //}
            })
    
            cb(null, results)
        })
    } catch (err) {
        return cb(err)
    }
}
