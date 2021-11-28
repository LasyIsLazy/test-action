/**
 * API: https://docs.github.com/en/rest/reference/repos#get-a-branch
 */
const core = require('@actions/core')
const github = require('@actions/github')


async function checkBranch(
    { token, owner, repo, branchName }
)
{
    const octokit = github.getOctokit(token)

    core.debug(`Checking if branch exists with name ${branchName} in repo ${repo}`)

    // load all branches, since we need the info about the default branch as well
    const res = await octokit.rest.repos.listBranches({ owner, repo })
        .then(({ data }) =>
        {
            // result succesful
            let jsonResult = JSON.stringify(data)
            core.debug(`Succesful API call with result: ${jsonResult}`)
            return { data: data }
        })
        .catch(err =>
        {
            if (err.toString() !== 'Error: Request failed with status code 404') {
                console.log(err)
            }
            // errors should not happen
            return { data: {} }
        })
    let branches = res.data

    let json = JSON.stringify(branches)
    core.debug(`Branches: ${json}`)

    if (branches == null) {
        core.debug('Error loading existing branches from API')
        return null
    }

    // check if the branch name already exists
    let branch = branches.find(function (branch) { return branch.name === branchName })

    if (branch) {
        core.debug(`Branch with name ${branchName} already exists, continuing as normal`)
        return branch
    }
    else {
        console.log(`Need to create a new branch first with name ${branchName}`)
        let defaultBranch = branches[0]
        console.log(`Found default branch to branch of: ${defaultBranch.name} with sha: ${defaultBranch.commit.sha}`)

        // Docs: https://octokit.github.io/rest.js/v18#git-create-ref
        return octokit.rest.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${branchName}`,
            sha: defaultBranch.commit.sha
        })
            .then(({ data }) =>
            {
                core.debug(`Branch with name ${defaultBranch.name} created`)
                // return non empty object to check on
                console.log(`Created new branch with ref: ${data.ref} based on ${defaultBranch.name}`)
                return data
            }).catch(err =>
            {
                core.debug(`Error creatng new branch: ${err}`)
                console.log(`Error creating the branch with name ${branchName} and sha ${defaultBranch.commit.sha}: ${err}`)
                return null
            })
    }
}
module.exports = checkBranch
