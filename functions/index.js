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

function addVpsList(mnkey, dropletId) {
  
  var data = {
    "expdate": "1621328211000",
    "mnstatus": "offline",
    "restart": 0,
    "uptime": 0,
    "vpsid": dropletId,
    "mnkey": mnkey
  };

  firebase.database().ref().child('vps').push().set(data)
  .then((res) => {
    console.log('Added to vps list');
  })
  .catch((err) => {
    console.log("Error adding to vps list: ", err);
  });
}

function deployDroplet(mnkey) {
  console.log("deploy", mnkey)
  axios({
    method: 'post',
    url: 'https://api.digitalocean.com/v2/droplets',
    data: dropletConfigs,
    headers: doConfigs
  })
  .then(function (response) {
    return addVpsList(mnkey, response.data.droplet.id);
  })
  .catch(function (error) {
    console.log("Error creating droplet\n", error);
  });
}

function checkIfExists(mnkey) {
  firebase.database().ref().child('vps').once('value', function(snapshot){
    snapshot.forEach((vpslist) => {
      let vpsinfo = vpslist.val();
      if(vpsinfo.ip && vpsinfo.mnkey === mnkey){
        return true;
      }
    });
    return false;
  });
}

exports.sauron = functions.database.ref('/orders/{orderId}').onWrite((event) => {
  const vpsinfo = event.data.val();
  for(var key in vpsinfo) {
    if (vpsinfo.hasOwnProperty(key)) {
      console.log('key',vpsinfo.key)
      if (!checkIfExists(vpsinfo.key)) {  
        console.log("function", vpsinfo.key)

        deployDroplet(vpsinfo.key);
        return null;
      } 
    }
  }
  return null;
});


