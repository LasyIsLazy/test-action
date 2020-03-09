const fs = require('fs')
const path = require('path')
const upload = require('./upload.js')
const core = require('@actions/core')
const filePath = core.getInput('file-path')
if (!fs.existsSync(filePath)) {
  core.setFailed(`filePath doesn't exist: ${filePath}`)
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
      const realPath = fs.realpathSync(itemPath)
      paths.push(realPath)
    }
  })
  return paths
}

const filePaths = getAllFilePaths(filePath)

async function uploadAll() {
  for (let index = 0; index < filePaths.length; index++) {
    const filePath = filePaths[index]
    const fileName = path.basename(filePath)
    console.log('Upload', fileName)
    const base64Cotent = fs.readdirSync(filePath, {
      encoding: 'base64'
    })
    await upload(base64Cotent, {
      Authorization: `Bearer ${core.getInput('access-token')}`,
      username: core.getInput('username'),
      repo: core.getInput('repo'),
      remoteDir: core.getInput('remote-dir'),
      fileName
    })
  }
}

uploadAll()
