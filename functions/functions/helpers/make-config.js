module.exports = (mnKey, ip) => {
    return 'rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\nrpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\nrpcallowip=127.0.0.1\nrpcbind=127.0.0.1\n#\nlisten=1\nserver=1\ndaemon=1\nmaxconnections=24\nport=18369\nmasternode=1\nmasternodeprivkey=' + mnKey + '\nexternalip=' + ip
}
