const admin = require('firebase-admin')
const randomKey = require('random-key')
const args = process.argv.slice(2)

let serviceAccount, email, months

try {
    serviceAccount = require('./serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json')
}

try {
    email = args[0]
    months = parseInt(args[1])
} catch (err) {
    throw new Error('ERROR: Incorrect params')
}

if (!months) {
    throw new Error('Invalid month number')
}

if (!email.length) {
    throw new Error('Invalid email')
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mm-development-3e770.firebaseio.com'
})

admin.database().ref('/codes').push({
    email,
    months,
    code: randomKey.generateBase30(17),
    redeemed: false
}).then(val => {
    console.log('SUCCESS! Retrieving code...')
    val.once('value', snap => {
        console.log('Code:')
        console.log(snap.val().code)
        console.log('Valid for email: ' + snap.val().email)
        console.log('Duration: ' + snap.val().months + ' months')

        process.exit(0)
    })
}).catch((err) => {
    process.stderr.write('ERROR: SOMETHING WENT WRONG')
    process.exit(1)
})
