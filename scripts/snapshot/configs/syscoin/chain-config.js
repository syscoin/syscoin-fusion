module.exports.config = (mnKey, ip) => {
    return 'rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\n' +
        'rpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\n' +
        'rpcallowip=127.0.0.1\n' +
        'rpcbind=127.0.0.1\n' +
        'addressindex=1\n' +
        'listen=1\n' +
        'server=1\n' +
        'daemon=1\n' +
        'maxconnections=24\n' +
        'port=8369\n' +
        'masternode=1\n' +
        'masternodeprivkey=' + mnKey + '\n' +
        'externalip=' + ip
}

module.exports.path = () => {
    return '/root/.syscoincore/syscoin.conf'
};

module.exports.nodeStatus = () => {
    return 'masternode status'
};

module.exports.checkReward = address => `chain-cli getaddressdeltas '{"addresses": ["${address}"]}'`