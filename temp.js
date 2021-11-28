const github = require("@actions/github");
const core = require("@actions/core");
const fs = require("fs/promises");

async function run() {
  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // myToken: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  const myToken = "4cb0d5f56f4a20dce07b148062e961595caa827d";

  const octokit = github.getOctokit(myToken);

  // You can also pass in additional options as a second parameter to getOctokit
  // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});

  const path = "test/1"
  let sha = ''
  const { data } = await octokit.rest.repos.getContent({
      owner: "LasyIsLazy",
      repo: "img",
      path,
    })
  console.log(status, data);
  const sha = data.sha
  const file = await fs.readFile("./1", { encoding: "base64" });
  
  try {
    const { status, data } = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "LasyIsLazy",
        repo: "img",
        path,
        message: "message",
        content: file,
        sha,
      }
    );
    console.log(status, data);
  } catch ({status,message, response}) {
    console.log(status, message);
  }
}

run();
