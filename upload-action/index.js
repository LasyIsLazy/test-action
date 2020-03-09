const upload = require('./upload.js')
const core = require('@actions/core')
const now = new Date()
console.log('上传', now.toLocaleString())
upload(Buffer.from(now.toLocaleString()).toString('base64'), {
  Authorization: `Bearer ${core.getInput('access-token')}`,
  username: core.getInput('username'),
  repo: core.getInput('repo'),
  remoteDir: core.getInput('remote-dir'),
  fileName: core.getInput('file-name') || now.getTime()
})
