module.exports = () => {
    if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        return 'production'
    }

    if (process.env.NODE_ENV === 'development') {
        return 'development'
    }

    if (process.env.NODE_ENV === 'test') {
        return 'test'
    }
}
