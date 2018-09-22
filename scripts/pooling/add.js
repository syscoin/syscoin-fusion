require('dotenv').config({path: process.cwd() + '/scripts/.env'})

const admin = require('firebase-admin')
const args = process.argv.slice(2)

let serviceAccount, email, sysAmount, operation, tier

try {
    serviceAccount = require('../serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json (it should be located in the scripts folder)')
}

try {
    email = args[0]
    sysAmount = parseFloat(args[1])
    operation = args[2]
    tier = parseInt(args[3])
} catch (err) {
    throw new Error('ERROR: Incorrect params')
}

if (!(email.length || sysAmount || operation)) {
    throw new Error('ERROR: Incorrect params')
}

if ((['add', 'substract']).indexOf(operation) === -1) {
    throw new Error('ERROR: Invalid operation')
}

if (([1,2,3]).indexOf(tier) === -1) {
    throw new Error('ERROR: Invalid tier')
}

if (tier === 1 && (sysAmount % 1000) !== 0) {
    throw new Error('ERROR: Tier 1 can only contribute in multiples of 1000.')
} else if (tier === 2 && (sysAmount % 10000) !== 0) {
    throw new Error('ERROR: Tier 2 can only contribute in multiples of 10000.')
} else if (tier === 3 && (sysAmount % 25000) !== 0) {
    throw new Error('ERROR: Tier 3 can only contribute in multiples of 25000.')
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.SCRIPT_DB_URL
})

admin.database().ref('/pooling/tier' + tier)
                .orderByChild('email')
                .equalTo(email)
                .once('value', snapshot => {
                    if (snapshot.hasChildren()) {
                        const val = snapshot.val()
                        const key = Object.keys(val)[0]

                        const historic = val[key].historic
                        let newAmount

                        if (operation === 'add') {
                            newAmount = parseFloat(val[key].sysAmount) + sysAmount
                        } else if (operation === 'substract') {
                            newAmount = parseFloat(val[key].sysAmount) - sysAmount
                        }

                        if (newAmount < 0) {
                            throw new Error('ERROR: User balance can\'t be below zero.')
                        }

                        historic.push({
                            sysAmount,
                            operation,
                            date: Date.now()
                        })

                        admin.database().ref('/pooling/tier' + tier + '/' + key)
                                        .update({
                                            sysAmount: newAmount,
                                            lastUpdate: Date.now(),
                                            historic
                                        })
                                        .then(() => {
                                            console.log(email + ' balance is now ' + newAmount)
                                            process.exit()
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            throw new Error('ERROR: Something went wrong during the update')
                                        })
                    } else {
                        admin.database().ref('/pooling/tier' + tier)
                                        .push({
                                            email,
                                            sysAmount,
                                            totalPayout: 0,
                                            lastUpdate: Date.now(),
                                            historic: [{
                                                sysAmount,
                                                operation,
                                                date: Date.now()
                                            }]
                                        })
                                        .then(() => {
                                            console.log(email + ' balance is now ' + sysAmount)
                                            process.exit()
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            throw new Error('ERROR: Something went wrong during the update')
                                        })
                    }
                })
