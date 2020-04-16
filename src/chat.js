import Box from '3box';

export const getThread = async (appName, channelName, persistent, organizer) => {
  console.log("chat.getThread()", appName, channelName, persistent, organizer);
  if (persistent) {
    return await Box.getThread(appName, channelName, organizer)
  } else {
    return await Box.getThread(appName, channelName)
  }
}
