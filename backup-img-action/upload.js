const axios = require('axios');
const BASE_URL = 'https://api.github.com';

async function upload(content, { Authorization, fileName }) {
  // GitHub API will decode the url
  const url =
    BASE_URL +
    '/repos/LasyIsLazy/img/contents/test/' +
    encodeURIComponent(fileName);
  // if content exists
  const res = await axios({
    method: 'get',
    url,
    responseType: 'application/json',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 200) {
    const sha = res.data.sha;
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
        sha,
        content
      }
    }).then(({ data }) => {
      const { path, sha } = data.content;
      return {
        uploadPath: path,
        sha
      };
    });
  }
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
