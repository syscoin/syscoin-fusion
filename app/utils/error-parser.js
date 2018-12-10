// @flow
export default (message: string) => {
    let index
    if (message.indexOf('ERRCODE') !== -1) {
        index = message.indexOf('ERRCODE')
    } else if (message.indexOf('error message:') !== -1) {
        index = message.indexOf('error message:') + 15
    } else {
        index = 0
    }

    return message.slice(index)
}