# Smart Chat

A Chat System SDK With On Chain Access Control List.

Built on top of [3Box](https://docs.3box.io/), and enfources smart contract logic for ACL.

[![npm](https://img.shields.io/npm/v/smart-chat-react.svg?style=for-the-badge)](https://www.npmjs.com/package/smart-chat-react)

![Example Screenshot](https://user-images.githubusercontent.com/46699230/79453919-f240e400-801c-11ea-8688-54d7ab4a512b.png)

<br />

## smart-chat-react

smart-chat-react is a Chat React component, built with the [3box-chatbox](https://github.com/open-tribe/3box-chatbox-react), and support smart contract functions to filter the members / moderators.

## Getting Started

1. Install the component
2. Use the component
3. Chat APIs

### 1. Install the component

```shell
npm i -S smart-chat-react
```


### 2. Use the component

#### Example

```jsx
import ChatRoom from 'smart-chat-react';
const Chat = props => {
  const {
    party,
    web3,
  } = props

  const members = party.participants.map(p => p.user.address)
  const moderators = party.admins.map(p => p.user.address)
  const owner = moderators && moderators.length > 0 ? moderators[0] : members[0];

  let canJoin = null
  let canModerate = null
  if (web3) {
    try {
      const contract = new web3.eth.Contract(Conference.abi, party.address)
      canJoin = {
        contract,
        method: "isRegistered"
      }
      canModerate = {
        contract,
        method: "isAdmin"
      }
    } catch(e) {
      console.log("Failed to load contract", party, e)
    }
  }

  return (
    <ChatRoom
      appName="Kickback"
      channelName={party.address}
      canJoin={canJoin}
      canModerate={canModerate}
      organizer={owner}
      members={members}
      moderators={moderators}
      colorTheme="#6E76FF"
      popup
    />
  )
}
```


#### Prop Types

| Property | Type          | Default  | Required Case          | Description |
| :-------------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appName`    | String        |    |  Always   |  The name of the dApp, which will be used as the 3Box space name by default. |
| `channelName`    | String       |   | Always    | A unique ID/name for this chat |
| `organizer`    | ETH Address         |   | Always   | The organizer of the chat, which will be used as the firstModerator parameter for a [Persistent Thread](https://docs.3box.io/build/web-apps/messaging/persistent-threads) in 3Box |
| `canJoin`    | Object         |   | Always   | The `contract` and `method` for verifying whether an account can join the chat or not |
| `canModerate`    | Object         |   | Always   | The `contract` and `method` to verifying whether an account can join as a moderator/admin of the chat |
| `members`    | Array of ETH Address         |   | Optional   | The members of a chat will be added if provided. |
| `moderators`    | Array of ETH Address         |   | Optional   | The moderators of a chat will be added if provided. |
| `secret`    | Boolean       |  False   | Optional    | A boolean - `true` - to make the chat content only visible to its members. False will make the chat visible to everyone. |
| `colorTheme`    | String/Boolean       |  False  | Optional    | Pass an rgb or hex color string to match the color theme of your application |
| `popup`    | Boolean       |  False   | Optional    | A boolean - `true` - to configure a pop up style chatbox with a button fixed to the bottom right of the window to pop open the chat UI. False will render the component in whichever container you have implemented. |
| `iconUrl`    | String       |    | Optional    | Set the icon for the chat window |

### 3. Chat APIs

Here we support the APIs for listing members and moderators of a chat. See the example below.

Let me know if you'd like to add more interfaces such as add members or moderators, which now are only supported via the React components.

#### Example

```js
import { getChat } from 'smart-chat-react';

const chat = await getChat(appName, channelName, organizer)

const members = await chat.listMembers()

const moderaors = await chat.listModerators()

```


## License

MIT



