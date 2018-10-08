module.exports.config = (mnKey, ip) => {
    return 'rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\r\n' +
        'rpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\r\n' +
        'port=9678\r\n' +
        'daemon=1\r\n' +
        'listen=1\r\n' +
        'server=1\r\n' +
        'smartnode=1\r\n' +
        'txindex=1\r\n' +
        'smartnodeprivkey=' + mnKey
};

module.exports.path = () => {
    return '/root/.syscoincore/syscoin.conf'
};

module.exports.nodeStatus = () => {
    return 'smartnode status'
};

module.exports.checkReward = address => ``