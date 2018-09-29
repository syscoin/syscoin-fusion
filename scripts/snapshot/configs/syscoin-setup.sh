#!/bin/sh
wget https://github.com/syscoin/syscoin/releases/download/3.1.4.0/syscoincore-3.1.4.0-x86_64-linux-gnu.tar.gz -O chain.tar.gz
mkdir chain && tar xvf chain.tar.gz -C chain --strip-components 1
mv chain/bin/syscoind /usr/bin/chaind
mv chain/bin/syscoin-cli /usr/bin/chain-cli
cd droplet-scripts
npm install
cd ~/sentinel
chaind -daemon
venv/bin/python bin/sentinel.py
