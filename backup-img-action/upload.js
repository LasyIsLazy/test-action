const axios = require('axios');
const BASE_URL = 'https://api.github.com';

function upload(content, { Authorization, fileName }) {
  // GitHub API will decode the url
  const url =
    BASE_URL +
    '/repos/LasyIsLazy/img/contents/test/' +
    encodeURIComponent(fileName);
  return axios({
    method: 'put',
    url,
    responseType: 'application/json',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    },
    data: {
      message: 'Auto backup',
      content
    }
  }).then(({ data }) => {
    return { uploadPath: data.content.path };
  });
}
module.exports = upload;
