const cron = require('node-cron')

// Tasks
const updateStatus = require('./update-status')

cron.schedule('* * * * *', () => {
    updateStatus()
})
