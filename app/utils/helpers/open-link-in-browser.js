// @flow
import { shell } from 'electron'

export default (url: string) => shell.openExternal(url)
