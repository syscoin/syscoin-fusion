// @flow

const getUnfinishedAliases = () => global.appStorage.get('tools').newAliases

const pushNewAlias = (alias: Object) => {
    const data = global.appStorage.get('tools')

    if (!data.newAliases) {
        data.newAliases = []
    }

    data.newAliases.push(alias)

    global.appStorage.set('tools', data)
}

const removeFinishedAlias = (aliasName: string) => {
    const data = global.appStorage.get('tools')
    const aliasIndex = data.newAliases.map(i => i.alias).indexOf(aliasName)

    data.newAliases.splice(aliasIndex, 1)

    global.appStorage.set('tools', data)
}

const incRoundToAlias = (aliasName: string) => {
    const data = global.appStorage.get('tools')
    const actualBlock = global.appStorage.get('walletinfo').blocks
    const aliasIndex = data.newAliases.map(i => i.alias).indexOf(aliasName)

    const selectedAlias = data.newAliases[aliasIndex]

    selectedAlias.round += 1
    selectedAlias.block = actualBlock

    data.newAliases[aliasIndex] = selectedAlias

    global.appStorage.set('tools', data)
}

module.exports = {
    getUnfinishedAliases,
    pushNewAlias,
    removeFinishedAlias,
    incRoundToAlias
}
