import React from 'react';
import Box from '3box';

import ChatBox from '3box-chatbox-react-enhanced';
import { filter } from './helper';
import { decorateHistory, waitForThread } from './chat';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // box: {},
      myProfile: {},
      myAddress: '',
      isReady: false,
      members: [],
      moderators: []
    }
  }

  async componentDidMount() {
    window.smart_chat = this;
    // this.handleLogin();
    this.updateAddress();
    this.filterMembers();
    this.filterModerators();
  }

  async componentWillReceiveProps() {
    this.filterMembers();
    this.filterModerators();
  }

  handleLogin = async () => {
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];

    const box = await Box.openBox(myAddress, window.ethereum, {});
    if (box) {
      const myProfile = await Box.getProfile(myAddress);
      box.onSyncDone(() => this.setState({ box }));
      this.setState({ box, myProfile, myAddress, isReady: true });
    }
  }

  updateAddress = async () => {
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];
    this.setState({ myAddress });
  }

  allowJoin = async (address) => {
    const { canJoin } = this.props;
    if (canJoin) {
      const { contract, method } = canJoin;
      return await contract.methods[method](address).call();
    } else {
      return false;
    }
  }

  allowModeration = async (address) => {
    const { canModerate } = this.props;
    if (canModerate) {
      const { contract, method } = canModerate;
      return await contract.methods[method](address).call();
    } else {
      return false;
    }
  }

  filterMembers = async () => {
    let { members } = this.props;
    if (members && members.length > 0) {
      members = await filter(members, async m => await this.allowJoin(m));
      this.setState({ members });
    }
  }

  filterModerators = async () => {
    let { moderators } = this.props;
    if (moderators && moderators.length > 0) {
      moderators = await filter(moderators, async m => await this.allowModeration(m));
      this.setState({ moderators });
    }
  }

  listMembers = async () => {
    const thread = await this.getThread();
    if (thread) {
      return await thread.listMembers();
    } else {
      return null;
    }
  }

  listModerators = async () => {
    const thread = await this.getThread();
    if (thread) {
      return await thread.listModerators();
    } else {
      return null;
    }
  }

  getHistory = async (count) => {
    const thread = await this.getThread();
    if (thread) {
      const posts = await thread.getPosts(count);
      return await decorateHistory(posts);
    } else {
      return null;
    }
  }

  onUpdate = async (callback) => {
    const thread = await this.getThread();
    if (thread) {
      return thread.onUpdate(callback);
    } else {
      return null;
    }
  }

  getThread = async () => {
    if (window.__chatbox_3box) {
      const thread = window.__chatbox_3box.state.thread;
      await waitForThread(thread);
      return thread;
    } else {
      return null;
    }
  }

  render() {
    const {
      box,
      myAddress,
      myProfile,
      isReady,
      members,
      moderators
    } = this.state;

    const {
      appName,
      channelName,
      organizer,
      popup,
      colorTheme,
      iconUrl,
      secret,
      onUpdate
    } = this.props;

    const agentProfile = {
      chatName: appName,
      imageUrl: iconUrl
    }

    if (secret && !members.includes(myAddress)) {
      return <div></div>
    }

    return (
      <ChatBox
        // required
        spaceName={appName}
        threadName={channelName}

        // case A & B
        box={box}
        currentUserAddr={myAddress}

        // case B
        loginFunction={this.handleLogin}

        // case C
        // ethereum={window.ethereum}

        // instance
        ref={(c) => { window.__chatbox_3box = c }}

        // optional
        // mute
        openOnMount
        popupChat={popup}
        showEmoji
        colorTheme={colorTheme}
      // colorTheme="#1168df"
      // threadOpts={{}}
      // spaceOpts={{}}
      // useHovers={true}
      // currentUser3BoxProfile={myProfile}
      // userProfileURL={(address) => `https://userprofiles.co/user/${address}`}

        // persistent
        persistent
        firstModerator={organizer}
        members={members}
        moderators={moderators}
        agentProfile={agentProfile}

        // callbacks
        onUpdate={onUpdate}
      />
    );
  }
}

export default ChatRoom;
