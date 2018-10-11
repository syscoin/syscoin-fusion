module.exports.config = (mnKey, ip) => {
    return 'rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\n' +
        'rpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\n' +
        'port=9678\n' +
        'daemon=1\n' +
        'listen=1\n' +
        'server=1\n' +
        'smartnode=1\n' +
        'txindex=1\n' +
        'addressindex=1\n' +
        'smartnodeprivkey=' + mnKey + '\n' +
        'externalip=' + ip
};

module.exports.path = () => {
    return '/root/.smartcash/smartcash.conf'
};

module.exports.nodeStatus = () => {
    return 'smartnode status'
};

module.exports.checkReward = address => `chain-cli getaddressdeltas '{"addresses": ["${address}"]}'`