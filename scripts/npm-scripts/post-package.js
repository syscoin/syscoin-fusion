const fs = require('fs')
const path = require('path')
const copy = require('copy')

let os = require('../../app/utils/detect-os')()

// OS dependand variables
let compiledSysDependenciesDir,
    unpackedDir,
    unpackedDirectory

if (os === 'win') {
    sysDependenciesDir = path.join(process.cwd(), 'sys_dependencies', 'windows')
    unpackedDirectory = path.join(process.cwd(), 'release', 'win-unpacked', 'sys_dependencies')
} else if (os === 'linux') {
    sysDependenciesDir = path.join(process.cwd(), 'sys_dependencies', 'linux')
    unpackedDirectory = path.join(process.cwd(), 'release', 'linux-unpacked', 'sys_dependencies')
} else if (os === 'osx') {
    sysDependenciesDir = path.join(process.cwd(), 'sys_dependencies', 'mac')
    unpackedDirectory = path.join(process.cwd(), 'release', 'mac', 'sys_dependencies')
}

try {
    fs.mkdirSync(unpackedDirectory)
} catch (e) {
    if (e.code !== 'EEXIST') {
        throw e
    }
}

copy(path.join(sysDependenciesDir, '*'), unpackedDirectory, () => {
    console.log('Sys dependencies copied!')
    process.exit()
})
