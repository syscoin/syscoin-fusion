module.exports = (mnKey, ip) => {
    return "#\nrpcuser=user\nrpcpassword=password\nrpcallowip=127.0.0.1\n#\nlisten=1\nserver=1\ndaemon=1\nmaxconnections=24\n#\ntestnet=1\naddnode=40.121.201.195\naddnode=40.71.212.2\naddnode=40.76.48.206\n#\nmasternode=1\nmasternodeprivkey=" + mnKey + "\nexternalip=" + ip
}
