import React from 'react';
// import '../../styles.css';
import { Row, Col } from 'reactstrap';
// import { useMessengerProvider } from '../Context/MessengerContext';
import Message from '../Message/Message';
import {Channel, ChannelMessage} from '../../messenger-types'
import { HubConnection } from '@microsoft/signalr';

type ActiveChannelProps = {
  connection: HubConnection | null
  name: string
}

const ActiveChannel = ({connection, name}: ActiveChannelProps) => {
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

export default ActiveChannel;
