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
   "image":"32682508",
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

function getDropIp(dropletId) {
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: `https://api.digitalocean.com/v2/droplets/${dropletId}`,
      headers: doConfigs
    })
    .then((res) => {
      console.log("dropletId: ", dropletId, "+ Network: " ,res.data.droplet.networks.v4)
      resolve(res.data.droplet.networks.v4.ip_address);
    })
    .catch((err) => {
      console.log('Error getting droplet information: ',err);
      reject(err);
    });
  });
}

function addVpsList(mnkey, dropletId) {
  
  var data = {
    "expdate": "1621328211000",
    "mnstatus": "offline",
    "restart": 0,
    "uptime": 0,
    "vpsid": dropletId,
    "mnkey": mnkey
  };

  //getDropIp(dropletId).then(function(result) {
    firebase.database().ref().child('vps').push().set(data)
    .then((res) => {
      console.log('Added to vps list');
    })
    .catch((err) => {
      console.log("Error adding to vps list: ", err);
    });
  //})
}

function deployDroplet(mnkey) {
  axios({
    method: 'post',
    url: 'https://api.digitalocean.com/v2/droplets',
    data: dropletConfigs,
    headers: doConfigs
  })
  .then(function (response) {
    setTimeout(function() { 
      addVpsList(mnkey, response.data.droplet.id);
    }, 6000);
  })
  .catch(function (error) {
    console.log("Error creating droplet\n", error);
  });
}

function checkIfExists(mnkey) {
  firebase.database().ref().child('vps').on('value', function(snapshot){
    snapshot.forEach((vpslist) => {
      let vpsinfo = vpslist.val();
     if(vpsinfo.ip && vpsinfo.mnkey === mnkey){
        return true;
      }
    });
    return false;
  });
}

function getUserList() {
  const secondary = firebase.initializeApp(secondConfig, "secondary");
  secondary.database().ref().on('value', function(snapshot){
    snapshot.forEach((vpslist, id) => {
      var vpsinfo = vpslist.val();
      for(var key in vpsinfo) {
        if (vpsinfo.hasOwnProperty(key)) {
          if (!checkIfExists(vpsinfo[key].key)) {          
            deployDroplet(vpsinfo[key].key)
          } 
        }
      }
    });
  });
}

function main() {
  getUserList();
}

main();