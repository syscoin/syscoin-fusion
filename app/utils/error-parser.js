// @flow
export default (message: string) => {
    let index
    if (message.indexOf('ERRCODE') !== -1) {
        index = message.indexOf('ERRCODE')
    } else if(message.indexOf('error message:')) {
        index = message.indexOf('error message:') + 16
    }

    if (!index) {
        index = 0
    }
    return message.slice(index)
}