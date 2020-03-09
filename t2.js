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
      paths.push(itemPath)
    }
  })
  return paths
}

console.log(getAllFilePaths('t1'))