var keypair = require('keypair');
var forge = require('node-forge');

var pair = keypair();
var publicKey = forge.pki.publicKeyFromPem(pair.public);
var ssh = forge.ssh.publicKeyToOpenSSH(publicKey, 'user@domain.tld');
console.log(ssh);