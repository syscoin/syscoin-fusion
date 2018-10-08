#!/usr/bin/env bash
echo "@reboot chaind -daemon -addressindex >/dev/null 2>&1" | crontab -
echo "$(echo '*/3 * * * * sh /root/droplet-scripts/cronscript.sh >/dev/null 2>&1' ; crontab -l)" | crontab -
echo "$(echo '* * * * * cd /root/sentinel && ./venv/bin/python bin/sentinel.py 2>&1 >> sentinel-cron.log' ; crontab -l)" | crontab -