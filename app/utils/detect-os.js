module.exports = () => {
    const { platform } = process

    if (platform === 'win32') {
        return 'win'
    } else if (platform === 'linux') {
        return 'linux'
    } else if (platform === 'darwin') {
        return 'osx'
    }
}
