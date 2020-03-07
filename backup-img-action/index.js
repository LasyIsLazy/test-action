const getImg = require('./get-img');
const upload = require('./upload.js');
const ora = require('ora');
const core = require('@actions/core');
(async function() {
  await getImg();

  const fs = require('fs');
  const dir = fs.readdirSync('./img');
  for (let index = 0; index < dir.length; index++) {
    const fileName = dir[index];

    const filePath = './img/' + fileName;
    const spinner = ora(`Upload: ${filePath}`).start();
    try {
      const { uploadPath, sha } = await upload(
        fs.readFileSync(filePath).toString('base64'),
        {
          Authorization: `Bearer ${core.getInput('ACCESS_TOKEN')}`,
          fileName
        }
      );
      spinner.succeed(
        `Upload succeed: ${filePath}, upload path: ${uploadPath}`
      );
      if (sha) {
        spinner.succeed(`Upload repleced succeed: ${filePath}`);
      }
    } catch (error) {
      spinner.fail(`Upload failed: ${filePath}`);
      console.log(error);
    }
  }
  const spinner = ora(`Upload: img-map.json`).start();
  await upload(fs.readFileSync('./img-map.json').toString('base64'), {
    Authorization: `Bearer ${core.getInput('ACCESS_TOKEN')}`,
    fileName: 'img-map.json'
  });
  spinner.succeed(`Upload succeed: img-map.json`);
})();
