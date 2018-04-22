'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'https://testting-mn.firebaseio.com'
})
const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

// Endpoints
const createNode = require('./endpoints/create-node')

// Listeners
const writeConfigToDroplet = require('./functions').writeConfigToDroplet
const editNodeData = require('./functions').editNodeData
const emailUserOnStatusChange = require('./functions').emailUserOnStatusChange
const deleteDeployedOrder = require('./functions').deleteDeployedOrder

// Tasks
const startUpdateStatusQueue = require('./functions/status-queue')
const processOrder = require('./functions/process-order')
//const deleteDeployLogs = require('./functions/delete-deploy-logs')

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res, next) => {

	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
		!req.cookies.__session) {
		res.status(403).send('Unauthorized')
		return
	}

	let idToken
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		// Read the ID Token from the Authorization header.
		idToken = req.headers.authorization.split('Bearer ')[1]
	} else {
		// Read the ID Token from cookie.
		idToken = req.cookies.__session
	}
	admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
		req.user = decodedIdToken
		return next()
	}).catch((error) => {
		res.status(403).send('Unauthorized')
	})
}

app.use(cors())
app.use(cookieParser)
app.use(bodyParser.json())
app.use(validateFirebaseIdToken)
app.post('/payment', createNode)

app.use((err, req, res, next) => {
	console.log(err)
	return res.status(500).send('Something went wrong')
})

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app)

exports.writeConfigToDroplet = writeConfigToDroplet
exports.editNodeData = editNodeData
exports.emailUserOnStatusChange = emailUserOnStatusChange
exports.deleteDeployedOrder = deleteDeployedOrder

exports.startUpdateStatusQueue = startUpdateStatusQueue
exports.processOrder = processOrder
