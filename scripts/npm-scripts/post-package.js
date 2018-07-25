const fs = require('fs')
const path = require('path')
const copy = require('copy')

const script_input = process.env.npm_lifecycle_script
let os

if (script_input.indexOf('--win') !== -1) {
    os = 'win32'
} else if (script_input.indexOf('--linux') !== -1) {
    os = 'linux'
}

// OS dependand variables
let compiledSysDependenciesDir,
    unpackedDir,
    unpackedDirectory

if (os === 'win32') {
    sysDependenciesDir = path.join(process.cwd(), 'sys_dependencies', 'windows')
    compiledSysDependenciesDir = path.join(process.cwd(), 'release', 'win-unpacked', 'sys_dependencies')
    unpackedDirectory = path.join(process.cwd(), 'release', 'win-unpacked', 'sys_dependencies')
} else if (os === 'linux') {
    sysDependenciesDir = path.join(process.cwd(), 'sys_dependencies', 'linux')
    compiledSysDependenciesDir = path.join(process.cwd(), 'release', 'linux-unpacked', 'sys_dependencies')
    unpackedDirectory = path.join(process.cwd(), 'release', 'linux-unpacked', 'sys_dependencies')
}

try {
    fs.mkdirSync(compiledSysDependenciesDir)
} catch (e) {
    if (e.code !== 'EEXIST') {
        throw e
    }
}

copy(path.join(sysDependenciesDir, '*'), unpackedDirectory, () => {
    console.log('Sys dependencies copied!')
    process.exit()
})
