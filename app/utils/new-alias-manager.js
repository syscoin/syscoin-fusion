// @flow

const getUnfinishedAliases = () => global.appStorage.get('tools').newAliases

const pushNewAlias = (alias: Object) => {
    const data = global.appStorage.get('tools')

    data.newAliases.push(alias)

    global.appStorage.set('tools', data)
}

const removeFinishedAlias = (aliasName: string) => {
    const data = global.appStorage.get('tools')
    const aliasIndex = data.newAliases.map(i => i.alias).find(i => i.alias === aliasName)

    data.newAliases.splice(aliasIndex, 1)

    global.appStorage.set('tools', data)
}

module.exports = {
    getUnfinishedAliases,
    pushNewAlias,
    removeFinishedAlias
}
