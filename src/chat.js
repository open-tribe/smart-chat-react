import Box from '3box';

export const getChat = async (appName, channelName, organizer) => {
  return await Box.getThread(appName, channelName, organizer)
}
