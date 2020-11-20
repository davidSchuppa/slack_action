const core = require('@actions/core');
const axios = require('axios');
import Message from './MessageFactory.js'

const SLACK_APP_TOKEN = process.env['SLACK_WEBHOOK'];

async function run() {
  try {
    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const userName = core.getInput('user_name');
    const userIcon = core.getInput('user_icon');
    const jobStatus = core.getInput('job_status');
    let actions = core.getInput('actions');


    const res = await axios({
      method: 'post',
      url: 'https://slack.com/api/chat.postMessage',
      data: Message.createMessage(jobStatus,
        channel,
        userName,
        message,
        userIcon,
        actions),
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${SLACK_APP_TOKEN}`,
      },
    });

    if (!res.data.ok) {
      console.log("resopnse",res)
      throw new Error(res.data.error);
    }

    core.setOutput("result", 'success');
  }
  catch (error) {
    core.setOutput("result", 'failure');
    core.setFailed(error.message);
  }
}

run()
