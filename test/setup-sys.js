import genCmd from 'fw-utils/cmd-gen'
import { exec } from 'child_process'
import Syscoin from 'fw/syscoin-js'
import { whilst } from 'async'

const syscoin = new Syscoin()

module.exports = async () => {
  let test = true
  let count = 0
  let error = false
  const cmd = genCmd('syscoind', '-addressindex -assetallocationindex -server -rpcallowip=127.0.0.1 -rpcport=8336 -rpcuser=u -rpcpassword=p')
  exec(cmd)
}