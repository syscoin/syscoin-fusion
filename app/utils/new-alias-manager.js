// @flow

type pushNewAliasType = {
    aliasName: string,
    block: number,
    round: number
};

const getUnfinishedAliases = () => {
    try {
        return global.appStorage.get('tools').newAliases
    } catch(err) {
        return []
    }
}

const pushNewAlias = (alias: pushNewAliasType) => {
    const data = global.appStorage.get('tools') || {}

    if (!data.newAliases) {
        data.newAliases = []
    }

    data.newAliases.push(alias)

    global.appStorage.set('tools', data)
}

const removeFinishedAlias = (aliasName: string) => {
    const data = global.appStorage.get('tools')
    const aliasIndex = data.newAliases.map(i => i.aliasName).indexOf(aliasName)

    data.newAliases.splice(aliasIndex, 1)

    global.appStorage.set('tools', data)
}

const incRoundToAlias = (aliasName: string, block?: number) => {
    const data = global.appStorage.get('tools')
    const actualBlock = block || global.appStorage.get('walletinfo').blocks
    const aliasIndex = data.newAliases.map(i => i.aliasName).indexOf(aliasName)

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
