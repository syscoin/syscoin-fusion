#!/bin/sh
wget https://github.com/SmartCash/Core-Smart/releases/download/v1.2.6/smartcash-1.2.6-x86_64-linux-gnu.tar.gz -O chain.tar.gz
mkdir chain && tar xvf chain.tar.gz -C chain --strip-components 1
mv chain/bin/smartcashd /usr/bin/chaind
mv chain/bin/smartcash-cli /usr/bin/chain-cli
cd droplet-scripts
npm install
chaind -daemon -addressindex
