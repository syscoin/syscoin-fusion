#!/bin/sh
wget https://github.com/syscoin/syscoin/releases/download/3.0.5.0/syscoincore-3.0.5-x86_64-linux-gnu.tar.gz -O chain.tar.gz
mkdir chain && tar xvf chain.tar.gz -C chain --strip-components 1
mv chain/bin/syscoind /usr/bin/chaind
mv chain/bin/syscoin-cli /usr/bin/chain-cli