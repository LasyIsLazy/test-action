const fs = require('fs');
const commonMark = require('commonmark');
const axios = require('axios');
const ora = require('ora');

const getAllImg = markdown => {
  if (!markdown) return;
  let parsed = new commonMark.Parser().parse(markdown);
  let walker = parsed.walker();
  let event;
  let nodeList = [];
  while ((event = walker.next())) {
    let node = event.node;
    if (node.type === 'image' && node.destination) {
      nodeList.push(node);
    }
  }
  const srcList = nodeList.map(node => node.destination);
  const uniqueSrcList = [...new Set(srcList)];

  return {
    srcList,
    uniqueSrcList,
    nodeList
  };
};

async function getImg() {
  const dir = fs.readdirSync('./posts');
  if (!fs.existsSync('./img')) {
    fs.mkdirSync('./img');
  }

  const imgMap = {};
  const jobs = [];
  dir.forEach(fileName => {
    const text = fs.readFileSync('./posts/' + fileName, { encoding: 'utf8' });
    const { uniqueSrcList } = getAllImg(text);
    imgMap[fileName] = uniqueSrcList;
    console.log(`${uniqueSrcList.length + 1} images in '${fileName}' `);
    uniqueSrcList.forEach(url => {
      jobs.push(() => {
        const spinner = ora(`Download ${url}`).start();
        return axios({
          method: 'get',
          url,
          timeout: 30000,
          responseType: 'stream',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36'
          }
        })
          .then(function(response) {
            response.data.pipe(
              fs.createWriteStream('./img/' + encodeURIComponent(url))
            );
            spinner.succeed(`Dowloaded: ${url}`);
          })
          .catch(err => {
            spinner.fail(`Dowloaded fail: ${url}`);
          });
      });
    });
  });

  console.log('Start download');
  for (const key in jobs) {
    if (jobs.hasOwnProperty(key)) {
      const job = jobs[key];
      await job();
    }
  }
  console.log('Download finished');

  console.log('Generate map', imgMap);
  fs.writeFileSync('./img-map.json', JSON.stringify(imgMap));
}

module.exports = getImg;
