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

console.log(getAllFilePaths('d://code/github/test-action/t1'))
console.log(path.relative('/a/b/c/d/', '/a/b'))
console.log(path.relative('/a/b/', '/a/b/c/d/'))
console.log(path.relative('t1/1', 't1'))
console.log(path.relative('t1', 't1/1'))
