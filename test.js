// const ora = require('ora')
// const spinner = ora({
//     text: 'Loading unicorns',
//     isEnabled: false
// }).start();
// setTimeout(() => {
//     spinner.color = 'yellow';
//     spinner.text = 'Loading rainbows';
//     setTimeout(() => {
//         spinner.succeed('xxx')
//         spinner.fail('xxx')
//     }, 1000);
// }, 1000);
const fs = require('fs');
const path = require('path');

function getAllMd(curPath, paths = []) {
  const dir = fs.readdirSync(curPath);
  dir.forEach(item => {
    const itemPath = path.join(curPath, item);
    const stat = fs.lstatSync(itemPath);
    if (stat.isDirectory()) {
      getAllMd(itemPath, paths);
    } else {
      if (itemPath.match(/.+\.md$/g).length) {
        const realPath = fs.realpathSync(itemPath);
        paths.push(realPath);
      }
    }
  });
  return paths;
}
const pths = getAllMd('./posts');
console.log(pths.toString())

