const admin = require('firebase-admin')
const args = process.argv.slice(2)

let serviceAccount, email

try {
    serviceAccount = require('../serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json')
}

try {
    email = args[0]
} catch (err) {
    throw new Error('ERROR: Incorrect params')
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mm-development-3e770.firebaseio.com'
})

admin.database().ref('/pooling')
                .orderByChild('email')
                .equalTo(email)
                .once('value', snapshot => {
                    if (snapshot.hasChildren()) {
                        const val = snapshot.val()
                        const key = Object.keys(val)[0]

                        console.log(email + ' balance is ' + val[key].sysAmount + ' SYS')
                        process.exit()
                    } else {
                        console.log('ERROR: User does not have contributions to the pool.')
                        process.exit()
                    }
                })
