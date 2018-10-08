const axios = require('axios')
var Client = require('ssh2').Client;
const fs = require('fs')
var client = require('scp2')

let coinName;
try {
    coinName = process.argv[2]
} catch {
    throw new Error('unable to get coin name from cmd')
}

console.log('Coin Name', coinName);

if(!coinName) {throw new Error('unable to get coin name from cmd')}


start(coinName)

async function start(name) {
    let deployedImgId = await createDroplet(name)
    let dropletIp;

    await setTimeout(async function () {
        dropletIp = await getDropletIp(deployedImgId)
        console.log('in getDropletIp', dropletIp)
    }, 15000);

    await setTimeout(function () {
        console.log('in transferScript')
        transferConfigScripts(dropletIp, name)
    }, 120000);

    await setTimeout(function () {
        console.log('in transferDropletScripts')
        transferDropletScripts(dropletIp)
    }, 140000);

    await setTimeout(function () {
        console.log('in logMeIn')
        logMeIn(dropletIp, name)
    }, 150000);
}

async function createDroplet(name) {
    let header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 4ba5a86eae566adaeb0015dcab3bb0a19ebd5054375d98b376b4e528ff33c17d'
    }

    let result = await axios.post('https://api.digitalocean.com/v2/droplets', {
        "name": name,
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
        headers: header
    })
    return result.data.droplet.id

}

async function getDropletIp(dropletId) {
    let header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 4ba5a86eae566adaeb0015dcab3bb0a19ebd5054375d98b376b4e528ff33c17d'
    }

    let res = await axios.get(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {headers: header})

    console.log('Droplet IP: ', res.data.droplet.networks.v4[0].ip_address)
    return res.data.droplet.networks.v4[0].ip_address
}

async function logMeIn(ip, name) {
    let bashScript = await bashScriptBuilder(name);
    var conn = new Client();
    conn.on('ready', function () {
        console.log('Client :: ready');
        conn.exec(bashScript, function (err, stream) {
            if (err) throw err;
            stream.on('close', function (code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function (data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function (data) {
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

async function transferConfigScripts(ip, name) {
    client.scp(`configs/${name}`, {
        host: ip,
        username: 'root',
        path: '/root/',
        privateKey: fs.readFileSync('basekey.pem')
    }, function (err) {
        if (err) {
            throw new Error('unable to transfer config scripts')
        }
    })
}

async function transferDropletScripts(ip) {
    client.scp('../droplet-scripts/', {
        host: ip,
        username: 'root',
        path: '/root/droplet-scripts',
        privateKey: fs.readFileSync('basekey.pem')
    }, function (err) {
        if (err) {
            throw new Error('unable to transfer droplet scripts')
        }
    })
}

async function bashScriptBuilder(coin) {
    let bashTemplate = `sh deps.sh; sh cron-setup.sh; sh ${coin}-setup.sh;`
    // let bashSysTemplate = `sh deps.sh;sh cron-setup.sh; sh sentinel-setup.sh; sh syscoin-setup.sh;`
    if(coin === 'syscoin'){
        bashTemplate = bashTemplate + 'sh sentinel-setup.sh;'
    }

    bashTemplate += 'sh cleanup.sh;';

    return bashTemplate
}