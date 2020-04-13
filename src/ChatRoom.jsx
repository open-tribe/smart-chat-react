import React from 'react';
import Box from '3box';

import ChatBox from '3box-chatbox-react';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // box: {},
      myProfile: {},
      myAddress: '',
      isReady: false,
    }
  }

  componentDidMount() {
    // this.handleLogin();
    window.smart_chat = this;
  }

  handleLogin = async () => {
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];

    if (this.allowJoin(myAddress)) {
      const box = await Box.openBox(myAddress, window.ethereum, {});
      const myProfile = await Box.getProfile(myAddress);

      box.onSyncDone(() => this.setState({ box }));
      this.setState({ box, myProfile, myAddress, isReady: true });
    }
  }

  allowJoin = async (address) => {
    const { canJoin } = this.props;
    if (canJoin) {
      const { contract, method } = canAttend;
      return await contract.methods[method](address).call()
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
      isReady
    } = this.state;

    const {
      appName,
      channelName,
    } = this.props;

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
        popupChat
      // colorTheme="#1168df"
      // threadOpts={{}}
      // spaceOpts={{}}
      // useHovers={true}
      // currentUser3BoxProfile={myProfile}
      // userProfileURL={(address) => `https://userprofiles.co/user/${address}`}
      />
    );
  }
}

export default ChatRoom;
