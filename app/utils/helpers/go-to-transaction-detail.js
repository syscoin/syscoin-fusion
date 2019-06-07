// @flow
import openInBrowser from './open-link-in-browser'

export default (txid: string) => openInBrowser(process.env.EXPLORER_TX_PATH + txid)
