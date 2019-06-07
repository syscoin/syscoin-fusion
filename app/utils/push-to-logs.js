import fs from 'fs'
import getDocsPath from 'fw-utils/get-doc-paths'

const { appendFile } = fs

module.exports = str => appendFile(getDocsPath().logPath, `
${(new Date()).toTimeString()}: ${str}\r\n
============================================================================\r\n`)
