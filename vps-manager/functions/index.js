'use strict';

const firebase = require('firebase');
const functions = require('firebase-functions');
const axios = require('axios');

var config = {
  apiKey: "AIzaSyDefrUVqsIlqyjOHv0gmisxtlIGr2q5M9w",
  authDomain: "mm-vps.firebaseapp.com",
  databaseURL: "https://mm-vps.firebaseio.com",
  projectId: "mm-vps",
  storageBucket: "mm-vps.appspot.com",
  messagingSenderId: "887160468504"
};

const apiToken ='776580e0a9e9930022597c78a1d3a764de5bed34427f7559e3294e62305eb103';

var dropletConfigs = {  
   "name":"masternode-clone",
   "region":"sfo2",
   "size":"s-1vcpu-2gb",
   "image":"32711725",
   "ssh_keys":null,
   "backups":false,
   "ipv6":true,
   "user_data":null,
   "private_networking":null,
   "volumes":null,
   "tags":[  
      "web"
   ]
};

const doConfigs = { Authorization: "Bearer " + apiToken };

firebase.initializeApp(config);

function getDropIp(dropletId, nodeId) {
  axios({
    method: 'get',
    url: `https://api.digitalocean.com/v2/droplets/${dropletId}`,
    headers: doConfigs
  })
  .then((res) => {
    updateVpsList(res.data.droplet.networks.v4[0].ip_address, nodeId);
  })
  .catch((err) => {
    console.log('Error getting droplet information: ',err);
  });

  return null;
}

function updateVpsList(ip, nodeId) {
  firebase.database().ref().child(`vps/${nodeId}`).update({ 'ip': ip }).then(function() {
    console.log('successfully updated missing ip for ', nodeId);
  }).catch(function(err) {
    console.log('Error updating IP', err);
  });

  return null;
}

exports.vpsListCreate = functions.database.ref('/vps/{vpsId}').onCreate((event) => {
  let vpsinfo = event.data.val();
  var nodeId = event.params.vpsId;

  if (!vpsinfo.ip && vpsinfo.vpsid) {
    getDropIp(vpsinfo.vpsid, nodeId);
  }

  return null;
});

function updateIpList(key, flag) {
  var data = {};
  if (flag) {
    data = {
      'destroy': 0
    };
  } else {
    data = {
      'restart': 0
    };

  }
  const ip = key.replace(/\./g, '-');

  console.log(`ip-to-update/${ip}`);
  firebase.database().ref().child(`ip-to-update/${ip}`).update(data)
  .then(function() {
    console.log('successfully updated ip for ', ip);
  }).catch(function(err) {
    console.log('Error updating IP', err);
  });

  return null;
}

function getDropletId(ip, flag) {
  firebase.database().ref().child('vps').on('value', function(snapshot){
    snapshot.forEach((vpslist) => {
      let vpsinfo = vpslist.val();

      if (ip.includes(vpsinfo.ip) && (ip.length === vpsinfo.ip.length)){
        if (flag) {
          deleteDroplet(vpsinfo.vpsid);
        } else {
          restartDroplet(vpsinfo.vpsid);
        }
        updateIpList(ip, flag);
      }
    });
  });
}

function deleteDroplet(id) {
  axios({
    method: 'delete',
    url: `https://api.digitalocean.com/v2/droplets/${id}`,
    headers: doConfigs
  })
  .then((res) => {
    console.log('successfully deleted droplet', id);
  })
  .catch((err) => {
    console.log('Error getting droplet information: ',err);
  });
}

function restartDroplet(id) {
  axios({
    method: 'post',
    url: `https://api.digitalocean.com/v2/droplets/${id}/actions`,
    data: {"type":"reboot"},
    headers: doConfigs
  })
  .then((res) => {
    console.log('successfully restarted droplet', id);
  })
  .catch((err) => {
    console.log('Error getting droplet information: ',err.response.data);
  });
}

exports.ipListUpdate = functions.database.ref('/ip-to-update/{ipAdd}').onUpdate((event) => {

  var data = event.data.val();
  var ip = event.params.ipAdd.replace(/-/g, '.');
  
  if (data.destroy) {
    getDropletId(ip, 1);
  } else if (data.restart) {
    getDropletId(ip, 0);
  }

  return null;
});

exports.ipListCreate = functions.database.ref('/ip-to-update/{ipAdd}').onCreate((event) => {

  var data = event.data.val();
  var ip = event.params.ipAdd.replace(/-/g, '.');
  
  if (data.destroy) {
    getDropletId(ip, 1);
  } else if (data.restart) {
    getDropletId(ip, 0);
  }

  return null;
});
