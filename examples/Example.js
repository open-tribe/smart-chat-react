import React from 'react';

import ChatRoom, { getChat } from '../src/index';

import './index.css';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myAddress: window.ethereum.selectedAddress
    }
  }

  async componentDidMount() {
    // test chat APIs
    setTimeout(async () => {
      const chat = await getChat('Experiment', 'chatbox', this.state.myAddress);
      const posts = await chat.getHistory();
      console.log('history1', posts);
    }, 5000);

    setTimeout(async () => {
      const posts = await window.smart_chat.getHistory();
      console.log('history2', posts);
    }, 5000);
  }

  render() {
    const {
      myAddress,
    } = this.state;

    return (
      <div className="App">
        <div className="example_page">
          <div className="example_page_header">
            <h2>Smart Chat <br /> Demo</h2>
          </div>
          <div className="userscontainer">
            <ChatRoom
              appName="Experiment"
              channelName="chatbox"
              // canJoin={canJoin}
              // canModerate={canModerate}
              organizer={myAddress}
              members={[myAddress]}
              moderators={[myAddress]}
              colorTheme="#0D9DF4"
              popup
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Example;
