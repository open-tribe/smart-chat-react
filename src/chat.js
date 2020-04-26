import Box from '3box';
import resolve from 'did-resolver';

export const getChat = async (appName, channelName, organizer) => {
  const box = await Box.create()
  const thread = await box.openThread(appName, channelName, { firstModerator: organizer, members: true })
  thread.getHistory = async (count) => {
    const posts = await thread.getPosts(count);
    return await decorateHistory(posts);
  }
  return thread;
}

export const getPosts = async (appName, channelName, organizer) => {
  const posts = await Box.getThread(appName, channelName, organizer, true)
  if (posts) {
    return await decorateHistory(posts);
  } else {
    return posts;
  }
}

const getEthAddr = async (did) => {
  if (did.slice(0, 4) === "did:") {
    const profile = await resolve(did);
    if (profile) {
      return profile.publicKey[2].ethereumAddress.toLowerCase();
    }
  }
  return did;
};

const decoratePost = async (post) => {
  if (post) {
    post['address'] = await getEthAddr(post['author']);
  }
  return post;
}

export const decorateHistory = async (posts) => {
  if (posts && posts.length > 0) {
    return await Promise.all(posts.map(p => decoratePost(p)))
  } else {
    return posts;
  }
}

export const waitForThread = (thread) => {
  return new Promise((resolve, reject) => {
    const verify = () => {
      if (thread && thread.getPosts) {
        resolve(true);
      } else {
        setTimeout(() => verify(), 500);
      }
    }
    verify();
  })
}

