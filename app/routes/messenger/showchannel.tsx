import { Row, Col } from 'reactstrap';
import { ChannelMessage } from '../../messenger-types';
import Message from '../../components/Message/Message';
import { ActionFunction, LoaderFunction, redirect, useLoaderData, LinksFunction } from 'remix';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import styles from '~/components/Messenger/styles.css';
import { getSessionActiveChannelAndId, getUserName } from '~/utils/session.server';
import { removeMessage, getMessagesForChannels } from '~/utils/messenger.server';


export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formDataItems = await getFormDataItemsFromRequest(request, ['action', 'messageID']);

  const { messageID, action } = formDataItems;

  console.log('showchannel actionfunction');
  console.log({messageID});


  if (action === '/refresh')
  {
    return redirect('/messenger/showchannel');
  }

  const actionData = messageID?.split(',');
  console.log({actionData})
  const messageId = actionData[0];

  if (messageId != null) {
    removeMessage({ messageId });
    return redirect('/messenger/showchannel');
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const {activeChannel, channelId} = await getSessionActiveChannelAndId(request)
  const name = await getUserName(request)

  try {
    const messageResults = await getMessagesForChannels([
      { channelId, name: '' },
    ]);
    const { messages } = messageResults;

    return {
      messages,
      activeChannel,
      name,
      channelId
    };
  } catch (error) {
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
