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
    const addresses = await window.ethereum.enable();
    const myAddress = addresses[0];

    // get chat history
    const chat = await getChat('Experiment', 'chatbox', myAddress);
    let posts = await chat.getHistory({limit: 5});
    console.log('last 5 posts', posts);

    this.setState({ myAddress })
  }

  onUpdate = () => {
    window.smart_chat.getHistory({ limit: 2}).then(posts => {
      console.log('onUpdate: last 2 posts', posts);
    })
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
              onUpdate={this.onUpdate}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Example;
