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
      const { uploadPath } = await upload(
        fs.readFileSync(filePath).toString('base64'),
        {
          Authorization: `Bearer ${core.getInput('ACCESS_TOKEN')}`,
          fileName
        }
      );
      spinner.succeed(
        `Upload finished: ${filePath}, upload path: ${uploadPath}`
      );
    } catch (error) {
      if (
        error.response &&
        error.response.data.message ===
          `Invalid request.\n\n"sha" wasn't supplied.`
      ) {
        spinner.succeed(`Upload alright exists: ${filePath}`);
      } else {
        spinner.fail(`Upload failed: ${filePath}`);
        console.log(error);
      }
    }
  }
})();
