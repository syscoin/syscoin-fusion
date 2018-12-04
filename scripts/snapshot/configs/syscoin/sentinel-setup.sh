#!/bin/sh
wget https://github.com/syscoin/sentinel/archive/1.1.1.tar.gz -O sentinel.tar.gz
mkdir sentinel && tar xvf sentinel.tar.gz -C sentinel --strip-components 1
cp -f sentinel.conf sentinel/sentinel.conf
cd sentinel
apt-get install -y virtualenv
virtualenv ./venv
./venv/bin/pip install -r requirements.txt
venv/bin/python bin/sentinel.py