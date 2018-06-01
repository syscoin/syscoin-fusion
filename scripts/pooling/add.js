const admin = require('firebase-admin')
const args = process.argv.slice(2)

let serviceAccount, email, sysAmount, operation

try {
    serviceAccount = require('../serviceKey.json')
} catch (err) {
    throw new Error('ERROR: Cant find serviceKey.json')
}

try {
    email = args[0]
    sysAmount = parseFloat(args[1])
    operation = args[2]
} catch (err) {
    throw new Error('ERROR: Incorrect params')
}

if (!(email.length || sysAmount || operation)) {
    throw new Error('ERROR: Incorrect params')
}

if ((['add', 'substract']).indexOf(operation) === -1) {
    throw new Error('ERROR: Invalid operation')
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
                        let newAmount

                        if (operation === 'add') {
                            newAmount = parseFloat(val[key].sysAmount) + sysAmount
                        } else if (operation === 'substract') {
                            newAmount = parseFloat(val[key].sysAmount) - sysAmount
                        }

                        if (newAmount < 0) {
                            throw new Error('ERROR: User balance can\'t be below zero.')
                        }

                        admin.database().ref('/pooling/' + key)
                                        .update({
                                            sysAmount: newAmount,
                                            lastUpdate: Date.now()
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
                        admin.database().ref('/pooling')
                                        .push({
                                            email,
                                            sysAmount,
                                            totalPayout: 0,
                                            lastUpdate: Date.now()
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
