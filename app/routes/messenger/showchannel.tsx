import { Row, Col } from 'reactstrap';
import { ChannelMessage } from '../../messenger-types';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import Message from '../../components/Message/Message';
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from 'remix';
import { getSession } from '~/sessions';
import { getMessagesForChannels } from '~/channelservice';
import { startSignalRConnection, stopSignalRConnection } from '~/services/signalR/signalrClient';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';

type DeleteMessageArgs = {
  clientConnection: HubConnection;
  messageId: string;
  channelId: string;
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
      console.log(`Deleted message msgId=${messageId}, channelId=${channelId}`);
      stopSignalRConnection(clientConnection)
    });
};

export const action: ActionFunction = async ({ request }) => {
  console.log('*****ACTION FUNCION IS BEEING CALLEd ***********************************************')
  const formDataItems = await getFormDataItemsFromRequest(request, [
    'action'
  ]);


  const { action } = formDataItems;

  console.log('formdataitems for showchannel');
  console.log(formDataItems);
  console.log({ action });
  const actionData = action?.split(',');
  const messageId = actionData[0]
  const channelId = actionData[1]

  if (channelId != null && messageId != null) {
    const clientConnection = await startSignalRConnection();
    deleteMessage({ clientConnection, messageId, channelId });
    return redirect('/messenger/showchannel');
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const activeChannel = await session.get('activeChannel');
  const channelId = await session.get('activeChannelId');
  const name = await session.get('userId');

  try {
    const messageResults = await getMessagesForChannels([
      { channelId, name: '', messages: [] },
    ]);
    // console.log('***Show Channel messages');
    // console.log(messageResults);

    const { messages } = messageResults;
    // console.log(messages);

    return {
      messages,
      activeChannel,
      name,
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
  const { messages, activeChannel, name } = useLoaderData();

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
