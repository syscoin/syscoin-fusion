'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: functions.config().projectconfig.databaseurl
})
const express = require('express')
const cookieParser = require('cookie-parser')()
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

// Endpoints
const createNode = require('./endpoints/create-node')
const hostingSignup = require('./endpoints/hosting-signup')
const getUserNodes = require('./endpoints/get-user-nodes')
const testDeplots = require('./endpoints/test-deploys')
const coinbasePostback = require('./endpoints/coinbase-postback')
const extendSubscription = require('./endpoints/extend-mn')
const getPoolingData = require('./endpoints/pooling-data')
const requestPooling = require('./endpoints/request-pooling')
const editNode = require('./endpoints/edit-node')
const dataTracking = require('./endpoints/data-tracking')
const creditCharge = require('./endpoints/credit-charge')
const cryptoCharge = require('./endpoints/crypto-charge')
const codeRedeem = require('./endpoints/code-redeem')

// ---- Droplet only endpoints
const editStatus = require('./endpoints/droplet-endpoints/edit-status')
const getMnData = require('./endpoints/droplet-endpoints/check-config')
const notificationReward = require('./endpoints/droplet-endpoints/email-reward')
const upgradeMn = require('./endpoints/user-upgrade')

// Listeners
const emailUserOnStatusChange = require('./functions').emailUserOnStatusChange
const emailOnDeploy = require('./functions').emailOnDeploy

// Tasks
const expiredMnWatch = require('./functions/expired-mn-watch')

// Middlewares
const checkIpWhitelist = require('./middlewares').checkIpWhitelist
const chargeIfNeeded = require('./middlewares').chargeIfNeeded
const gatherData = require('./middlewares').gatherData

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

const validateOptionalFirebaseIdToken = (req, res, next) => {

	if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
		!req.cookies.__session) {
		return next()
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
//app.get('/test/deploys', testDeplots)
app.post('/payment', validateFirebaseIdToken, createNode)
app.post('/signup', hostingSignup)
app.post('/coinbase-postback', coinbasePostback)
app.post('/credit-charge', validateFirebaseIdToken, creditCharge)
app.post('/crypto-charge', validateFirebaseIdToken, cryptoCharge)
app.post('/code-redeem', validateFirebaseIdToken, codeRedeem)
app.post('/extend-subscription', validateFirebaseIdToken, extendSubscription)
app.post('/request-pooling', validateFirebaseIdToken, requestPooling)
app.post('/upgrade-mn', validateFirebaseIdToken, upgradeMn)
app.get('/nodes', validateFirebaseIdToken, getUserNodes)
app.get('/pooling-data', validateOptionalFirebaseIdToken, getPoolingData)
app.post('/edit-node', validateFirebaseIdToken, editNode)
app.post('/info', dataTracking)

app.post('/droplets/edit-status', checkIpWhitelist, gatherData, chargeIfNeeded, editStatus)
app.get('/droplets/get-mn-data', checkIpWhitelist, gatherData, chargeIfNeeded, getMnData)
app.post('/droplets/reward-notification', checkIpWhitelist, notificationReward)

app.use((err, req, res, next) => {
	console.log(err)
	return res.status(500).send('Something went wrong')
})

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app)

exports.emailUserOnStatusChange = emailUserOnStatusChange
exports.emailOnDeploy = emailOnDeploy

// exports.expiredMnWatch = expiredMnWatch