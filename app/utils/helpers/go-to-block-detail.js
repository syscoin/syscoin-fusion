// @flow
import openInBrowser from './open-link-in-browser'

export default (blockhash: string) => openInBrowser(process.env.EXPLORER_BLOCK_PATH + blockhash)
