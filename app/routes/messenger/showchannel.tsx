import { Row, Col } from 'reactstrap';
import { ChannelMessage } from '../../messenger-types';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import Message from '../../components/Message/Message';
import { ActionFunction, LoaderFunction, redirect, useLoaderData, useSubmit, LinksFunction } from 'remix';
import { getMessagesForChannels } from '~/channelservice';
import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import React from 'react';
import styles from '~/components/Messenger/styles.css';
import { getSessionActiveChannelAndId, getUser } from '~/utils/session.server';

type DeleteMessageArgs = {
  clientConnection: HubConnection;
  messageId: string;
  channelId: string;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const deleteMessage = ({
  clientConnection,
  messageId,
  channelId,
}: DeleteMessageArgs) => {
  if (
    !clientConnection ||
    clientConnection.state != HubConnectionState.Connected
  )
    return;

  clientConnection
    ?.invoke('RemoveChannelMessage', Number(channelId), Number(messageId))
    .then(() => {
      stopSignalRConnection(clientConnection);
    });
};

export const action: ActionFunction = async ({ request }) => {
  const formDataItems = await getFormDataItemsFromRequest(request, ['action']);

  const { action } = formDataItems;

  console.log('action in showchannel action function')
  console.log(action)

  if (action === '/refresh')
  {
    return redirect('/messenger/showchannel');
  }

  const actionData = action?.split(',');
  const messageId = actionData[0];
  const channelId = actionData[1];

  if (channelId != null && messageId != null) {
    const clientConnection = await startSignalRConnection();
    deleteMessage({ clientConnection, messageId, channelId });
    return redirect('/messenger/showchannel');
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const {activeChannel, channelId} = await getSessionActiveChannelAndId(request)
  const name = await getUser(request)

  try {
    const messageResults = await getMessagesForChannels([
      { channelId, name: '', messages: [] },
    ]);
    const { messages } = messageResults;

    return {
      messages,
      activeChannel,
      name,
      channelId
    };
  } catch (error) {
    console.log('In catch of catch-try');
    console.log({ error });
    return {
      error,
    };
  }
};

const ShowChannel = () => {
  const { messages, activeChannel, name, channelId } = useLoaderData();
  const submit = useSubmit();
  const [connection, setConnection] = React.useState<HubConnection | null>(
    null
  );

  const messageRefresher = () => {
    console.log('MessageRefresher Called ****')
    submit(null, { method: "post", action: "/refresh" })
  }

  React.useEffect(() => {
    const int = setInterval(() => {
      submit(null, {method: 'post', action: '/refresh'})
    }, 10000);

    console.log('**************USE EFFECT******************************')
    const getConnection = async () => {
      const cc = await startSignalRConnection();
      setConnection(cc);
      if (cc.state === HubConnectionState.Connected) {
        cc.invoke('SubscribeToMessageChannel', channelId)
        cc.on('messageAdded', messageRefresher)
        cc.on('messageDeleted', messageRefresher)
      }
    };

    getConnection();

    return () => {
      clearInterval(int)
      if (connection?.state === HubConnectionState.Connected)
      {
        connection.off('messageAdded', messageRefresher)
        connection.off('messageDeleted', messageRefresher)

      }
      connection && stopSignalRConnection(connection);
    };
  }, []);


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
                <Message message={m} user={name} />
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
                <Message message={m} user={name} />
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
                <Message message={m} user={name} />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShowChannel;
