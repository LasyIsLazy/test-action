const upload = require('./upload.js')
const core = require('@actions/core')
const now = new Date()
console.log('上传', now.toLocaleString())
const repo = `img`
const username = `LasyIsLazy`
const remoteDir = '/test3/tt'
upload(Buffer.from(now.toLocaleString()).toString('base64'), {
  Authorization: `Bearer ${core.getInput('ACCESS_TOKEN')}`,
  fileName: now.getTime(),
  repo,
  username,
  remoteDir
})
