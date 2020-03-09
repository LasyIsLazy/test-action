const fs = require('fs')
const path = require('path')
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
console.log(getAllFilePaths('t1'))