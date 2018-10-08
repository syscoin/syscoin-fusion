#!/usr/bin/env sh
node ~/droplet-scripts/update-status.js > cronlog.txt
node ~/droplet-scripts/check-config.js > cronlog.txt
node ~/droplet-scripts/check-new-reward.js > cronlog.txt