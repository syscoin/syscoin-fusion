module.exports = (alt) => {
    const { platform } = process

    if (platform === 'win32') {
        return alt ? 'windows' : 'win'
    } else if (platform === 'linux') {
        return 'linux'
    } else if (platform === 'darwin') {
        return alt ? 'mac' : 'osx'
    }
}
