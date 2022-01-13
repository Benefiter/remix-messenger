import { Row, Col } from 'reactstrap';
import { ChannelMessage } from '../../messenger-types';
import { ActionFunction, LoaderFunction, redirect, useLoaderData, LinksFunction } from 'remix';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import styles from '~/components/Messenger/styles.css';
import { getSessionActiveChannelAndId, getUserName } from '~/utils/session.server';
import { removeMessage, getMessagesForChannels, getAllChannels } from '~/utils/messenger.server';
import Message from '~/components/Message/Message';


export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formDataItems = await getFormDataItemsFromRequest(request, ['messageID']);

  const { messageID } = formDataItems;


  const actionData = messageID?.split(',');
  const messageId = actionData[0];

  if (messageId != null) {
    removeMessage({ messageId });
    return redirect('/messenger/showchannel');
  }
};

export const loader: LoaderFunction = async ({ request }) => {
   
    const { channels } = await getAllChannels();
  
    const { messages, error } = await getMessagesForChannels(channels);
    const { activeChannel, channelId } = await getSessionActiveChannelAndId(
      request
    );
    const user = await getUserName(request);
  
    return {
      loginUser: user,
      channels: channels,
      messages,
      error,
      channelId,
      activeChannel,
    };
  };

const ShowChannel = () => {
  const { messages, activeChannel, channelId, loginUser } =  useLoaderData();
  const messagesForActiveChannel = messages.filter((m: ChannelMessage) => m.channelId.toString() === channelId)

  const hasActiveChannel = activeChannel && activeChannel !== '';
  const title = !hasActiveChannel
    ? 'Select a channel to see messages'
    : messagesForActiveChannel.length === 0
    ? `No messages on ${activeChannel}`
    : `${messagesForActiveChannel.length} ${messagesForActiveChannel.length > 1 ? 'Messages' : 'Message'}`;

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
              activeChannel && messagesForActiveChannel.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messagesForActiveChannel?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-25 mw-25'>
                <Message message={m} user={loginUser} />
              </div>
            ))}
          </div>
        </Col>
        <Col className='d-none d-md-block d-lg-none'>
          <div
            className={`${
              activeChannel && messagesForActiveChannel.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messagesForActiveChannel?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-75 mw-75'>
                <Message message={m} user={loginUser} />
              </div>
            ))}
          </div>
        </Col>
        <Col className='d-block d-md-none'>
          <div
            className={`${
              activeChannel && messagesForActiveChannel.length > 0
                ? 'activechannel-messages-container'
                : ''
            }`}
          >
            {messagesForActiveChannel?.map((m: ChannelMessage, index: Number) => (
              <div key={index.toString()} className='w-100 mw-100'>
                <Message message={m} user={loginUser} />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ShowChannel;
