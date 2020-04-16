import React from 'react';
import Box from '3box';

import ChatBox from '3box-chatbox-react-enhanced';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: {},
      myProfile: {},
      myAddress: '',
      isReady: false,
      members: [],
      moderators: []
    }
  }

  componentDidMount() {
    window.smart_chat = this;
    this.handleLogin();
  }

  componentWillReceiveProps() {
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

  filterMembers() {
    let { members } = this.props;
    if (members && members.length > 0) {
      members = members.filter(m => this.allowJoin(m));
      this.setState({ members });
    }
  }

  filterModerators() {
    let { moderators } = this.props;
    if (moderators && moderators.length > 0) {
      moderators = moderators.filter(m => this.allowModeration(m));
      this.setState({ moderators });
    }
  }

  listMembers() {
    if (window.__chatbox_3box) {
      window.__chatbox_3box.state.thread.listMembers();
    } else {
      return null;
    }
  }

  listModerators() {
    if (window.__chatbox_3box) {
      window.__chatbox_3box.state.thread.listModerators();
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
      iconUrl
    } = this.props;

    const agentProfile = {
      chatName: appName,
      imageUrl: iconUrl
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
      />
    );
  }
}

export default ChatRoom;
