#!/usr/bin/env bash
apt-get install python-minimal -y
apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs
apt-get update