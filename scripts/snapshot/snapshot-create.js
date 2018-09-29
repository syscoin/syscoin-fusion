
const admin = require('firebase-admin')
const axios = require('axios')
var Client = require('ssh2').Client;
var mmKeyGen = require('/Users/q/eye-of-sauron/functions/endpoints/helpers/create-keys.js')
const fs = require('fs')
var conn = new Client();
var client = require('scp2')

// let serviceAccount, dbUrl;
//
// try {
//     serviceAccount = require('../serviceKey.json')
//     dbUrl = 'https://mm-dev-v2.firebaseio.com'
//
// } catch (err) {
//     throw new Error('ERROR: Cant find serviceKey.json (it should be located in the scripts folder)')
// }
//
//


// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: dbUrl
// })
//
// admin.database().ref('/configs')
//     .once('value', (snapshot) => {
//         if (snapshot.hasChildren()) {
//             const val = snapshot.val()
//
//             console.log('lalalala')
//             console.log(val)
//         } else {
//             console.log('ERROR: User does not have contributions to the pool.')
//         }
//     })


start()

async function start(){
     let deployedImgId = await createDroplet()
      // sleep(450000);
     let dropletIp;
     // sleep(120000);

    await setTimeout(async function(){
        dropletIp  = await getDropletIp(deployedImgId)
        console.log('dropletIp', dropletIp)
    }, 15000);


    await setTimeout(function(){
        console.log('in transferScript')
        transferConfigScripts(dropletIp)
    }, 120000);

    await setTimeout(function(){
        console.log('in transferDropletScripts')
        transferDropletScripts(dropletIp)
    }, 140000);

    await setTimeout(function(){
        console.log('in logmein')
         logMeIn(dropletIp)
    }, 150000);

    //logMeIn('142.93.29.188')
    //transferScript('159.89.141.133')
    //transferDropletScripts('142.93.26.132')
    //let keys = await mmKeyGen();
    //console.log(keys.keys)
}

 async function writeUserData(coin) {
    await admin.database().ref(`/configs/${coin}`).set({
        coin: 'SYSCOIN',
        prefix: 'syscoin-cli'
    }).catch(e => {
        console.log('it failed')
    })
     process.exit()
}


async function createDroplet() {
    let result = await axios.post('https://api.digitalocean.com/v2/droplets', {
            "name": "example.com",
            "region": "sfo2",
            "size": "s-1vcpu-1gb",
            "image": "ubuntu-16-04-x64",
            "ssh_keys": ["02:d4:e4:0f:88:53:68:6d:94:88:b2:24:bf:9c:b7:a8"],
            "backups": false,
            "ipv6": true,
            "user_data": null,
            "private_networking": null,
            "volumes": null,
            "tags": [
                "test"
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 4ba5a86eae566adaeb0015dcab3bb0a19ebd5054375d98b376b4e528ff33c17d'
            }
        })

    console.log('res',result.data.droplet.id)

    return result.data.droplet.id

}

async function getDropletIp(dropletId){
    let res = await axios.get(`https://api.digitalocean.com/v2/droplets/${dropletId}`, { headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 4ba5a86eae566adaeb0015dcab3bb0a19ebd5054375d98b376b4e528ff33c17d'
        } })

    console.log('getDropletIp res ===============>', res.data.droplet.networks.v4[0].ip_address)
    return res.data.droplet.networks.v4[0].ip_address
}


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

async function logMeIn(ip){
    var conn = new Client();
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.exec('sh deps.sh ;sh syscoin-setup.sh; sh sentinel-setup.sh; chaind;', function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function(data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: ip,
        port: 22,
        username: 'root',
        privateKey: fs.readFileSync('basekey.pem')
    });
}

async function transferConfigScripts(ip){
    client.scp('configs/', {
        host: ip,
        username: 'root',
        path: '/root/',
        privateKey: fs.readFileSync('basekey.pem')
    }, function(err) {
        if(err){
            throw new Error('unable to transfer')
        }
    })
}

async function transferDropletScripts(ip){
    client.scp('../droplet-scripts/', {
        host: ip,
        username: 'root',
        path: '/root/droplet-scripts',
        privateKey: fs.readFileSync('basekey.pem')
    }, function(err) {
        if(err){
            throw new Error('unable to transfer')
        }
    })
}