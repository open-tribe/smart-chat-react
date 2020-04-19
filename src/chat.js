const Box = require('3box');

const getChat = async (appName, channelName, organizer) => {
  const box = await Box.create()
  return await box.openThread(appName, channelName, { firstModerator: organizer, members: true })
}

const getPosts = async (appName, channelName, organizer) => {
  return await Box.getThread(appName, channelName, organizer, true)
}

module.exports = {
  getChat,
  getPosts
}
