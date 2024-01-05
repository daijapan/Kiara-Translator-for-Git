import axios from "axios";
import { github_base_url, github_api_version } from "../index.js";

const github_access_token = process.env.GITHUB_USER_TOKEN;

const headersLoad = (github_user_token = github_access_token) => {
   return {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${github_user_token}`,
        'X-Github-Api-Version': github_api_version
    }
}

export const signIn = async (req, res) => {
  // hit the github api to get the response with access token
  if (!req.body) {
    return res.status(400).send({
      message: "Request body can not be empty."
    });
  }

  let response = await axios.get(`${github_base_url}/user`, {
        headers: headersLoad,
  });

  res.status(200).json({data: response.data });
}


// get the list of the github repos
// param:
//   - access_token
//   - username
// return:
//   - list of repos

export const getListOfRepos = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
        message: "Request body can not be empty."
        });
    }
    res.status(200).json({ data: "Hello World" });
}


// get the list of the repo issues
// param:
//   - access_token
//   - username
//   - repo name
// return:
//   - list of issues

export const getListOfIssues = async (req, res) => {
    // hit the github api to get the response with access token
    // and get the repo specific issues list
    if (!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty."
        });
    }
    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let query_state = req.body.data.query.state;
    let access_token = req.body.data.accessToken;
    // URL: https://api.github.com/repos/{owner}/{repo}/issues?state={query_state}
    let response = await axios.get(`${github_base_url}/repos/${owner}/${repo}/issues?state=${query_state}`, {
        headers: headersLoad(access_token),
    })
    // get the repo specific issues list
    res.status(200).json({ data: response.data });
}


// get the list of the repo issues comments
// param:
//   - access_token
//   - username
//   - repo name
// return:
//   - list of issues comments
// URL: /repos/{owner}/{repo}/issues/comments
export const getListOfIssueComments = async (req, res) => {
    // hit the github api to get the response with access token

    if (!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty."
        });
    }
    let response = await axios.get(`${github_base_url}/repos/${req.body.data.owner}/${req.body.data.repo}/issues/comments`, {
        headers: headersLoad(req.body.data.accessToken),
    })
    // get the repo specific issues list
    res.status(200).json({ data: response.data });
}


// update an issue comment
// param:
//   - access_token
//   - username
//   - repo name
//   - comment_id
//   - comment
// return:
//   - updated comment
// URL: /repos/{owner}/{repo}/issues/comments/{comment_id}

export const updateIssueComment = async (req, res) => {
    // hit the github api to get the response with access token

    if (!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty."
        });
    }

    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let comment_id = req.body.data.comment_id;
    let comment = req.body.data.body;
    let access_token = req.body.data.accessToken;
    let data = {
        body: comment
    }

    let response = await axios.patch(`${github_base_url}/repos/${owner}/${repo}/issues/comments/${comment_id}`, data, {
        headers: headersLoad(access_token)
    })
    // get the repo specific issues list
    res.status(200).json({ data: response.data });
}

export const writeIssueComment = async (req, res) => {
    // hit the github api to get the response with access token

    if (!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty."
        });
    }

    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let issue_number = req.body.data.issue_number;
    let comment = req.body.data.comment;
    
    let data = {
        body: comment
    }

    let response = await axios.post(`${github_base_url}/repos/${owner}/${repo}/issues/${issue_number}/comments`, data, {
        headers: headersLoad
    })
    // get the repo specific issues list
    res.status(200).json({ data: response.data });
}


//===================================================================================================
// PR Related APIs
//===================================================================================================
// get the list of the repo prs
// param:
//   - access_token
//   - username
//   - repo
// return:
//   - list of prs
// URL Format: https://api.github.com/repos/OWNER/REPO/pulls

export const getListOfPRs = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
        message: "Request body can not be empty."
        });
    }
    let owner = req.body.data.owner;
    let repo = req.body.data.repo;

    let response = await axios.get(`${github_base_url}/repos/${owner}/${repo}/pulls`, {
        headers: headersLoad,
    })
    res.status(200).json({ data: response.data });
}

// get the pr of the repo prs
// param:
//   - access_token
//   - username
//   - repo
//   - prnumber
// return:
//   - pr
// URL Format: https://api.github.com/repos/OWNER/REPO/pulls/PULL_NUMBER

export const getPR = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
        message: "Request body can not be empty."
        });
    }
    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let prnumber = req.body.data.prnumber;

    let response = await axios.get(`${github_base_url}/repos/${owner}/${repo}/pulls/${prnumber}`, {
        headers: headersLoad,
    })
    res.status(200).json({ data: response.data });
}

// get the comments of the repo prs
// param:
//   - access_token
//   - username
//   - repo
//   - pr
// return:
//   - list of comments
// URL Format: https://api.github.com/repos/OWNER/REPO/pulls/PULL_NUMBER/comments

export const getListOfPRComments = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
            message: "Request body can not be empty."
        });
    }

    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let prnumber = req.body.data.prnumber;

    let response = await axios.get(`${github_base_url}/repos/${owner}/${repo}/pulls/${prnumber}/comments`, {
        headers: headersLoad,
    })
    res.status(200).json({ data: response.data });
}

// write the comments of the repo prs
// param:
//   - access_token
//   - username
//   - repo
//   - pr
//   - comment
// return:
//   - PR
// URL: https://api.github.com/repos/OWNER/REPO/pulls/PULL_NUMBER/comments

export const writePRComment = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
        message: "Request body can not be empty."
        });
    }
    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let prnumber = req.body.data.prnumber;
    let comment = req.body.data.comment;

    let requestData = {
        "body": comment
    };

    let response = await axios.post(`${github_base_url}/repos/${owner}/${repo}/pulls/${prnumber}/comments`, requestData, {
        headers: headersLoad,
    })

    res.status(200).json({ data: response.data });
}


// Create a review reply
// param:
//   - access_token
//   - username
//   - repo
//   - pr
//   - comment
// return:
//   - PR
// URL: https://api.github.com/repos/OWNER/REPO/pulls/PULL_NUMBER/comments/COMMENT_ID/replies

export const createPRReviewReply = async (req, res) => {
    // hit the github api to get the response with access token
    if (!req.body) {
        return res.status(400).send({
        message: "Request body can not be empty."
        });
    }
    let owner = req.body.data.owner;
    let repo = req.body.data.repo;
    let prnumber = req.body.data.prnumber;
    let comment_id = req.body.data.comment_id;
    let comment = req.body.data.comment;

    let requestData = {
        "body": comment
    };

    let response = await axios.post(`${github_base_url}/repos/${owner}/${repo}/pulls/${prnumber}/comments/${comment_id}/replies`, requestData, {
        headers: headersLoad,
    })

    res.status(200).json({ data: response.data });
}

//===================================================================================================
// End of PR Related APIs
//===================================================================================================
