// @flow
export default (message: string) => {
    const index = message.indexOf('ERRCODE')
    return message.slice(index)
}