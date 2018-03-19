var firebase = require('firebase');
var axios = require('axios');

var config = {
  apiKey: "AIzaSyDefrUVqsIlqyjOHv0gmisxtlIGr2q5M9w",
  authDomain: "mm-vps.firebaseapp.com",
  databaseURL: "https://mm-vps.firebaseio.com",
  projectId: "mm-vps",
  storageBucket: "mm-vps.appspot.com",
  messagingSenderId: "887160468504"
};

var secondConfig = {
   apiKey: "AIzaSyCBsdL7Mb631t9XpuLbTnMcnHzb11Nx-zg",
   authDomain: "mm-users.firebaseapp.com",
   databaseURL: "https://mm-users.firebaseio.com",
   projectId: "mm-users",
   storageBucket: "mm-users.appspot.com",
   messagingSenderId: "182104933081"
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

function getDropIp(key, dropletId) {
    axios({
      method: 'get',
      url: `https://api.digitalocean.com/v2/droplets/${dropletId}`,
      headers: doConfigs
    })
    .then((res) => {
      updateVpsList(key, res.data.droplet.networks.v4[0].ip_address);
    })
    .catch((err) => {
      console.log('Error getting droplet information: ',err);
    });
}

function updateVpsList(key, ip) {
  firebase.database().ref().child(`vps/${key}`).update({ 'ip': ip }).then(function() {
    console.log('successfully updated missing ip for ', key);
  }).catch(function(err) {
    console.log('Error updating IP', err);
  });
}

function checkVpsList() {
  firebase.database().ref().child('vps').on('value', function(snapshot){
    snapshot.forEach((vpslist) => {
      let vpsinfo = vpslist.val();
      if(!vpsinfo.ip && vpsinfo.vpsid){
        getDropIp(vpslist.key, vpsinfo.vpsid);
      }
    });
  });
}

function updateIpList(key, flag) {
  var data = {};
  if(flag) {
    data = {
      'delete': 0
    };
  } else {
    data = {
      'reboot': 0
    };

  }
  firebase.database().ref().child(`ip-to-update/${key}`).update(data).then(function() {
    console.log('successfully updated missing ip for ', key);
  }).catch(function(err) {
    console.log('Error updating IP', err);
  });
}

function getDropletId(ip, flag) {
  firebase.database().ref().child('vps').on('value', function(snapshot){
    snapshot.forEach((vpslist) => {
      let vpsinfo = vpslist.val();
      if(ip.includes(vpsinfo.ip) && (ip.length === vpsinfo.ip.length)){
        if(flag)
          deleteDroplet(vpsinfo.vpsid);
        else
          restartDroplet(vpsinfo.vpsid);
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

function checkUpdateList() {
  firebase.database().ref().child('ip-to-update').on('value', function(snapshot){
    snapshot.forEach((iplist) => {
      let ipinfo = iplist.val();
      const ip = iplist.key.replace(/-/g, '.');
      if(ipinfo.destroy) {
        getDropletId(ip, 1);
      } else if(ipinfo.restart) {
        getDropletId(ip, 0);
      }
    });
  });
}

function main() {
  checkVpsList();
  checkUpdateList();
}

main();