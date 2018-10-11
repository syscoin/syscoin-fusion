#!/usr/bin/env bash
echo "@reboot chaind -daemon -addressindex >/dev/null 2>&1" | crontab -
echo "$(echo '*/3 * * * * sh /root/droplet-scripts/cronscript.sh >/dev/null 2>&1' ; crontab -l)" | crontab -