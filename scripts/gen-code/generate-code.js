require('dotenv').config({path: process.cwd() + '/scripts/.env'})

const admin = require('firebase-admin')
const randomKey = require('random-key')
const args = process.argv.slice(2)

let serviceAccount, email, amount, times

try {
    serviceAccount = require('../serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json (it should be located in the scripts folder)')
}

try {
    email = args[0]
    amount = parseInt(args[1])
    times = parseInt(args[2])
} catch (err) {
    throw new Error('ERROR: Incorrect params')
}

if (!amount) {
    throw new Error('Invalid amount')
}

if (!email.length) {
    throw new Error('Invalid email')
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.SCRIPT_DB_URL
})

for (let i = 0 ; i < times ; i++) {
    admin.database().ref('/codes').push({
        email,
        amount,
        code: randomKey.generateBase30(17),
        redeemed: false
    }).then(val => {
        console.log('SUCCESS! Retrieving code...')
        val.once('value', snap => {
            console.log('Code:')
            console.log(snap.val().code)
            console.log('Valid for email: ' + snap.val().email)
            console.log('Amount: ' + snap.val().amount + ' cents')
        })
    }).catch((err) => {
        process.stderr.write('ERROR: SOMETHING WENT WRONG')
    })    
}
