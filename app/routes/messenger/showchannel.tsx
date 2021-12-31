import { Row, Col } from 'reactstrap';
import { ChannelMessage } from '../../messenger-types';
import { HubConnection } from '@microsoft/signalr';
import Message from '../../components/Message/Message';
import { LoaderFunction, useLoaderData } from 'remix';
import { getSession } from '~/sessions';
import { getMessagesForChannels } from '~/channelservice';

type ActiveChannelProps = {
  connection: HubConnection | null;
  name: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const activeChannel = await session.get('activeChannel');
  const channelId = await session.get('activeChannelId');

  console.log('Show Channel');
  console.log({ activeChannel, channelId });

  try {
    const messageResults = await getMessagesForChannels([
      { channelId, name: '', messages: [] },
    ]);
    console.log('***Show Channel messages');
    console.log(messageResults)

    const {messages} = messageResults
    console.log(messages);

    return {
      messages,
      activeChannel,
    };
  } catch (error) {
    console.log('In catch of catch-try');
    console.log({ error });
    return {
      error,
    };
  }
};

const ShowChannel = ({ connection, name }: ActiveChannelProps) => {
  const { messages, activeChannel } = useLoaderData();

  const hasActiveChannel = activeChannel !== '';
  const title = !hasActiveChannel
    ? 'Select a channel to see messages'
    : messages.length === 0
    ? `No messages on ${activeChannel}`
    : `${messages.length} ${messages.length > 1 ? 'Messages' : 'Message'}`;

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
            {messages?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-25 mw-25'>
                <Message message={m} connection={connection} user={name} />
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
            {messages?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-75 mw-75'>
                <Message message={m} connection={connection} user={name} />
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
            {messages?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-100 mw-100'>
                <Message message={m} connection={connection} user={name} />
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
import ActiveChannel from './../../components/ActiveChannel/ActiveChannel';

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
//   const channels = res.data;
//   const existingMessages = await getChannelMessages(channels);

//   return {
//     connection: startSignalRConnection(),
//     loginUser: session.has('userId') ? await session.get('userId') : null,
//     channels,
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
//     channels,
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

//       channels.forEach((c: Channel) => {
//         subscribeToChannelMessageUpdates(c.channelId);
//       });
//     }

//     return () => {
//       channels.forEach((c: Channel) =>
//         unsubscribeFromChannelMessageUpdated(c.channelId)
//       );
//       clientConnection?.off('channelAdded', onChannelAddedCallback);

//       clientConnection?.off('channelDeleted', onChannelDeletedCallback);
//       clientConnection && stopSignalRConnection(clientConnection);
//     };
//   }, [existingMessages, channels]);

//   return (
//     <>
//       <Layout
//         channels={channels}
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
