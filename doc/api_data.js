define({ "api": [
  {
    "type": "get",
    "url": "/droplets/get-mn-data",
    "title": "Get MN data",
    "description": "<p>Goes through API filter - Returns all MN data so the droplet can check if it has the correct config. If not, will reconfigure and restart.</p>",
    "group": "Droplets_Endpoints",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n       mnIndex: String,\n       mnKey: String,\n       mnName: String,\n       mnTxid: String,\n       ip: String\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/droplet-endpoints/check-config.js",
    "groupTitle": "Droplets_Endpoints",
    "name": "GetDropletsGetMnData"
  },
  {
    "type": "post",
    "url": "/droplets/edit-status",
    "title": "Edit MN status",
    "description": "<p>Goes through API filter - Edits MN status shown in UI.</p>",
    "group": "Droplets_Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>New status</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    error: false,\n    message: `Status updated to ${status}`\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/droplet-endpoints/edit-status.js",
    "groupTitle": "Droplets_Endpoints",
    "name": "PostDropletsEditStatus"
  },
  {
    "type": "post",
    "url": "/droplets/email-reward",
    "title": "Fires email reward notification",
    "description": "<p>Goes through API filter - Sends notification to user on new reward</p>",
    "group": "Droplets_Endpoints",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n    error: false\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/droplet-endpoints/email-reward.js",
    "groupTitle": "Droplets_Endpoints",
    "name": "PostDropletsEmailReward"
  },
  {
    "type": "get",
    "url": "/nodes",
    "title": "Get user nodes",
    "description": "<p>Needs firebase authentication - no params taken</p>",
    "group": "Endpoints",
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n\t\"masternodes\": [\n\t\t{\n\t\t\t\"expiresOn\": 1559678130103,\n\t\t\t\"numberOfMonths\": 12,\n\t\t\t\"paymentId\": \"B4HMKMPV6RFR34UQ6\",\n\t\t\t\"purchaseDate\": 1528142130103,\n\t\t\t\"totalCharge\": 180,\n\t\t\t\"userId\": \"mkIYEF2gCERwj0bzwghW7Z0A7A72\",\n\t\t\t\"id\": \"-LEBMahKyDCv7Uhi8Lp9\",\n\t\t\t\"mnData\": {\n\t\t\t\t\"mnIndex\": \"0\",\n\t\t\t\t\"mnKey\": \"5KSSq3TWJvsdReVAS9fCfGFCHaTrK6RDJbCBGewUbgRwJ5WBsTB\",\n\t\t\t\t\"mnName\": \"mn3\",\n\t\t\t\t\"mnTxid\": \"2465b4a92612ddd853f658c37d8b192b658a54691bf4441ebdbafe80971b0bb3\",\n\t\t\t\t\"orderId\": \"-LEBMahKyDCv7Uhi8Lp9\",\n\t\t\t\t\"userId\": \"mkIYEF2gCERwj0bzwghW7Z0A7A72\",\n\t\t\t\t\"vpsId\": \"-LEBMahUdZ_kJCNdKUNP\",\n\t\t\t\t\"id\": \"-LEBMaiIS1oev0Serw0r\"\n\t\t\t},\n\t\t\t\"vpsInfo\": {\n\t\t\t\t\"configFile\": \"rpcuser=GanAtiOPENdsLaTeOtIBEhesUpespOSI\\nrpcpassword=toNTImpaNDYBrustoGrUTomEndrayAtW\\nrpcallowip=127.0.0.1\\nrpcbind=127.0.0.1\\n#\\nlisten=1\\nserver=1\\ndaemon=1\\nmaxconnections=24\\nport=8369\\nmasternode=1\\nmasternodeprivkey=5KSSq3TWJvsdReVAS9fCfGFCHaTrK6RDJbCBGewUbgRwJ5WBsTB\\nexternalip=138.68.230.49\\n\",\n\t\t\t\t\"imageId\": \"35666737\",\n\t\t\t\t\"ip\": \"138.68.230.49\",\n\t\t\t\t\"lastUpdate\": 1532559841662,\n\t\t\t\t\"lock\": true,\n\t\t\t\t\"orderId\": \"-LEBMahKyDCv7Uhi8Lp9\",\n\t\t\t\t\"status\": \"Not capable masternode: Masternode not in masternode list\",\n\t\t\t\t\"uptime\": 0,\n\t\t\t\t\"userId\": \"mkIYEF2gCERwj0bzwghW7Z0A7A72\",\n                \"vpsid\": 96358319,\n                \"shouldUpdate\": true, // Only if VPS is upgradable\n\t\t\t\t\"id\": \"-LEBMahUdZ_kJCNdKUNP\"\n\t\t\t}\n\t\t}\n\t],\n\t\"isDeploying\": false\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/get-user-nodes.js",
    "groupTitle": "Endpoints",
    "name": "GetNodes"
  },
  {
    "type": "get",
    "url": "/pooling-data",
    "title": "Get pooling data",
    "description": "<p>No params taken</p>",
    "group": "Endpoints",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n    {\"activeMasternodes\":0,\"nextMnProgress\":0,\"column\":[\"Tier 1\",0],\"tier\":1},\n    {\"activeMasternodes\":0,\"nextMnProgress\":0,\"column\":[\"Tier 2\",0],\"tier\":2},\n    {\"activeMasternodes\":0,\"nextMnProgress\":0,\"column\":[\"Tier 3\",0],\"tier\":3}\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/pooling-data.js",
    "groupTitle": "Endpoints",
    "name": "GetPoolingData"
  },
  {
    "type": "post",
    "url": "/coinbase-postback Coinbase postback",
    "title": "Will need someone else to describe this endpoint.",
    "group": "Endpoints",
    "version": "0.0.0",
    "filename": "functions/endpoints/coinbase-postback.js",
    "groupTitle": "Endpoints",
    "name": "PostCoinbasePostbackCoinbasePostback"
  },
  {
    "type": "post",
    "url": "/edit-node",
    "title": "Edit node",
    "description": "<p>Needs firebase authentication - You need to send ALL these fields, even if you want to edit only one</p>",
    "group": "Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnIndex",
            "description": "<p>new MN index</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnKey",
            "description": "<p>new MN key</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnName",
            "description": "<p>new MN name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnTxid",
            "description": "<p>new MN txid</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>mn-data DB id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n       error: false\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/edit-node.js",
    "groupTitle": "Endpoints",
    "name": "PostEditNode"
  },
  {
    "type": "post",
    "url": "/extend-subscription",
    "title": "Extend subscription",
    "group": "Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "orderId",
            "description": "<p>Order database ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "tokenId",
            "description": "<p>Stripe token</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "months",
            "description": "<p>Numbr of months to extend</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "coinbase",
            "description": "<p>Coinbase payment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Use code to extend MN</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"cc\"",
              "\"coin\"",
              "\"code\""
            ],
            "optional": false,
            "field": "paymentMethod",
            "description": "<p>Payment method</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n       message: 'Success'\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/extend-mn.js",
    "groupTitle": "Endpoints",
    "name": "PostExtendSubscription"
  },
  {
    "type": "post",
    "url": "/payment",
    "title": "Node payment and creation",
    "description": "<p>Needs firebase authentication</p>",
    "group": "Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "token",
            "description": "<p>Payment token received from Stripe - Required only if the payment method is 'cc'</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "months",
            "description": "<p>Number of paid months</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnKey",
            "description": "<p>Masternode key provided by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnTxid",
            "description": "<p>Masternode txid provided by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnName",
            "description": "<p>Masternode name provided by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mnIndex",
            "description": "<p>Masternode index provided by the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>Payment method</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "code",
            "description": "<p>Coupon code - required only if method is 'code'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nodeType",
            "description": "<p>Coin selected</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\n\t\"message\": \"Payment completed\",\n\t\"expiresOn\": 1535238405885,\n\t\"purchaseDate\": 1532560005885,\n\t\"paymentId\": \"ch_1Crw48JiaRVP2JosFEAzwu82\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/create-node.js",
    "groupTitle": "Endpoints",
    "name": "PostPayment"
  },
  {
    "type": "post",
    "url": "/request-pooling",
    "title": "Request info about pooling",
    "description": "<p>Needs firebase authentication</p>",
    "group": "Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "tier",
            "description": "<p>Tier number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "shares",
            "description": "<p>Number of shares</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comments",
            "description": "<p>User special comments</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{\"message\":\"Successfuly applied\"}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/request-pooling.js",
    "groupTitle": "Endpoints",
    "name": "PostRequestPooling"
  },
  {
    "type": "post",
    "url": "/upgrade-mn",
    "title": "Upgrade MN",
    "description": "<p>Needs firebase authentication - Upgrade the version of an specific MN</p>",
    "group": "Endpoints",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "dropletId",
            "description": "<p>Droplet ID (which can be found in vps collection as &quot;vpsid&quot; property)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success",
          "content": "{error: false, message: 'Masternode updated successfully.' }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "functions/endpoints/user-upgrade.js",
    "groupTitle": "Endpoints",
    "name": "PostUpgradeMn"
  }
] });
