const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./db')

module.exports = {
    getItem: key => {
        return JSON.parse(localStorage.getItem(key))
    },
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    }
}