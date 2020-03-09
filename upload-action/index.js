const fs = require('fs')
const path = require('path')
const upload = require('./upload.js')
const core = require('@actions/core')
const inputPath = core.getInput('file-path')
if (!fs.existsSync(inputPath)) {
  core.setFailed(`filePath doesn't exist: ${inputPath}`)
  return
}

function getAllFilePaths(curPath, paths = []) {
  const dir = fs.readdirSync(curPath)
  dir.forEach(item => {
    const itemPath = path.join(curPath, item)
    const stat = fs.lstatSync(itemPath)
    if (stat.isDirectory()) {
      getAllFilePaths(itemPath, paths)
    } else {
      paths.push(itemPath)
    }
  })
  return paths
}

const filePaths = getAllFilePaths(inputPath)

async function uploadAll() {
  for (let index = 0; index < filePaths.length; index++) {
    const curPath = filePaths[index]
    const base64Cotent = fs.readFileSync(curPath, {
      encoding: 'base64'
    })
    const remotePath = path.join(
      core.getInput('remote-dir'),
      path.relative(curPath, inputPath)
    )
    console.log(`Upload ${curPath} to ${remotePath}`)
    await upload(base64Cotent, {
      Authorization: `Bearer ${core.getInput('access-token')}`,
      username: core.getInput('username'),
      repo: core.getInput('repo'),
      remotePath
    })
  }
}

uploadAll()
