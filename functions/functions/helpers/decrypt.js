const aes256 = require('aes256')

module.exports = (typeLen, hashKey) => {
    //get pre-append key
    var enc = hashKey.slice(0, typeLen);
    //actual hash 
    var hashStr = hashKey.substring(typeLen, hashKey.length);
    
    //decrypt to get privkey
    var sshpPrvkey = aes256.decrypt(enc, hashStr);
    
    return sshpPrvkey
}
