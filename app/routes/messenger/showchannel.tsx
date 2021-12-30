import React from 'react';
// import '../../styles.css';
import { Row, Col } from 'reactstrap';
// import { useMessengerProvider } from '../Context/MessengerContext';
import {Channel, ChannelMessage} from '../../messenger-types'
import { HubConnection } from '@microsoft/signalr';
import Message from '../../components/Message/Message';

type ActiveChannelProps = {
  connection: HubConnection | null
  name: string
}

const ShowChannel = ({connection, name}: ActiveChannelProps) => {
//   const { state } = useMessengerProvider();
//   const { activeChannel, channels } = state;
  const [messages, setMessages] = React.useState<ChannelMessage[]>([]);
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = React.useState('')

  const hasActiveChannel = activeChannel !== '';
  const title = !hasActiveChannel
    ? 'Select a channel to see messages'
    : messages.length === 0
    ? `No messages on ${activeChannel}`
    : `${messages.length} ${messages.length > 1 ? 'Messages' : 'Message'}`;

  React.useEffect(() => {
    if (activeChannel === '') {
      setMessages([]);
      return;
    }
    const channel = channels.find(c => c.name === activeChannel);

    if (!channel) {
      setMessages([]);
      return;
    }

    setMessages(channel.messages);
  }, [activeChannel, channels]);

  return (
    <div
      className={` messages-content ${
        !hasActiveChannel ? 'no-activechannel-title' : ''
      }`}
    >
      <h3 className={`activechannel-title mb-0`}>{title}</h3>
      <Row className='no-gutters m-0'>
        <Col className='d-none d-lg-block'>
          <div
            className={`${
              activeChannel && messages.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messages?.map((m, index) => (
              <div key={index} className='w-25 mw-25'>
                <Message message={m} connection={connection} user={name}/>
              </div>
            ))}
          </div>
        </Col>
        <Col className='d-none d-md-block d-lg-none'>
          <div
            className={`${
              activeChannel && messages.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messages?.map((m, index) => (
              <div key={index} className='w-75 mw-75'>
                <Message message={m} connection={connection} user={name}/>
              </div>
            ))}
          </div>
        </Col>
        <Col className='d-block d-md-none'>
          <div
            className={`${
              activeChannel && messages.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messages?.map((m, index) => (
              <div key={index} className='w-100 mw-100'>
                <Message message={m} connection={connection} user={name}/>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShowChannel;




// import { ActionFunction, LinksFunction, LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';
// import { commitSession, getSession } from '~/sessions';
// import axios from 'axios';
// import { env } from 'process';
// import { Channel, ChannelMessage } from '~/messenger-types';
// import Layout from '~/components/Layout';

// import React from 'react';
// import {
//   startSignalRConnection,
//   stopSignalRConnection,
// } from '~/services/signalR/signalrClient';
// import { HubConnection } from '@microsoft/signalr';
// import styles from '~/components/Messenger/styles.css';

// export const links: LinksFunction = () => {
//   return [
//     {
//       rel: 'stylesheet',
//       href: styles,
//     },
//   ];
// };

// export const action: ActionFunction = async ({ request }) => {
//   let session = await getSession(request.headers.get('Cookie'));
//   const formData = await request.formData();

//   const channelId = formData.get('channelId');
//   console.log({ channelId });

//   session.set('activeChannelId', channelId);
//   return redirect('messenger/showchannel', {
//     headers: {
//       'Set-Cookie': await commitSession(session),
//     },
//   });
// };

// export const loader: LoaderFunction = async ({ request }) => {
//   const session = await getSession(request.headers.get('Cookie'));
//   env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

//   const res = await axios.get('https://localhost:5001/channels');
//   const existingChannels = res.data;
//   const existingMessages = await getChannelMessages(existingChannels);

//   return {
//     connection: startSignalRConnection(),
//     loginUser: session.has('userId') ? await session.get('userId') : null,
//     existingChannels,
//     existingMessages,
//   };
// };

// const getChannelMessages = async (channels: Channel[]) => {
//   return Promise.all(
//     channels.map(async c => {
//       let resp;
//       resp = await axios.get(
//         `https://localhost:5001/channels/${c.channelId}/messages`
//       );
//       return resp?.data;
//     })
//   ).then(results =>
//     results.reduce((prev, cur) => {
//       return [...prev, ...cur];
//     }, [])
//   );
// };

// const Index = () => {
//   const {
//     existingChannels,
//     existingMessages,
//     loginUser,
//     connection,
//   } = useLoaderData();
//   const [clientConnection] = React.useState<HubConnection | null>(connection);

//   const messageAddedCallbackWrapper = (msg: ChannelMessage) => {};

//   const messageDeletedCallbackWrapper = (messageId: Number) => {};

//   const subscribeToChannelMessageUpdates = (channelId: Number) => {
//     if (clientConnection) {
//       clientConnection.invoke('SubscribeToMessageChannel', channelId);

//       clientConnection.on('messageAdded', messageAddedCallbackWrapper);

//       clientConnection.on('messageDeleted', messageDeletedCallbackWrapper);
//     }
//   };

//   const unsubscribeFromChannelMessageUpdated = (channelId: Number) => {
//     if (clientConnection) {
//       clientConnection.off('messageAdded', messageAddedCallbackWrapper);

//       clientConnection.off('messageDeleted', messageDeletedCallbackWrapper);
//     }
//   };

//   const onChannelAddedCallback = (newChannel: Channel) => {
//     subscribeToChannelMessageUpdates(newChannel.channelId);
//   };

//   const onChannelDeletedCallback = (channelId: Number) => {
//     unsubscribeFromChannelMessageUpdated(channelId);
//   };

//   React.useEffect(() => {
//     console.log('useEFfect of getMessages called *********')

//     if (clientConnection) {
//       clientConnection.on('channelAdded', onChannelAddedCallback);

//       clientConnection.on('channelDeleted', onChannelDeletedCallback);

//       existingChannels.forEach((c: Channel) => {
//         subscribeToChannelMessageUpdates(c.channelId);
//       });
//     }

//     return () => {
//       existingChannels.forEach((c: Channel) =>
//         unsubscribeFromChannelMessageUpdated(c.channelId)
//       );
//       clientConnection?.off('channelAdded', onChannelAddedCallback);

//       clientConnection?.off('channelDeleted', onChannelDeletedCallback);
//       clientConnection && stopSignalRConnection(clientConnection);
//     };
//   }, [existingMessages, existingChannels]);

//   return (
//     <>
//       <Layout
//         existingChannels={existingChannels}
//         existingMessages={existingMessages}
//         loginUser={loginUser}
//         clientConnection={clientConnection}
//       >
//         <Outlet />
//       </Layout>
//     </>
//   );
// };

// export default Index;
