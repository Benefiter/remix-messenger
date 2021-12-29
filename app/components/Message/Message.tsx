import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { Actions } from '../../reducers/message/actions';
import { useMessengerProvider } from '../Context/MessengerContext';
import { ChannelMessage } from '~/messenger-types';

type MessageProps = {
  message: ChannelMessage
}

const Message = ({message}: MessageProps) => {
  const { author, content, createdOn, messageId, channelId } = message;
  const { state, dispatch, connected } = useMessengerProvider();
  const { clientConnection, user } = state;

  const deleteMessage = () => {
    if (connected && !connected()) return;

    clientConnection.invoke(
      'RemoveChannelMessage',
      Number(channelId),
      Number(messageId)
    ).then(() => dispatch && dispatch({ type: Actions.removeChannelMessage, payload: {channelId, messageId}}))
  };

  const iconClass = author === user ? 'enable-delete' : 'disable-delete'
  return (
    <Card className='m-2'>
      <CardBody >
        <div title="Delete" className={`${iconClass}`} onClick={() => deleteMessage()}>
          <i className='bi-x-lg d-flex justify-content-end' />
        </div>
        <div className='message-header'>
          <div className="">{`Sender: ${author}`}</div>
          <div>{`Received: ${moment(createdOn).format(
            'MMM DD YYYY hh:mm:ss a'
          )}`}</div>
        </div>
        <div className='message-content'>
          <div className='p-2 text-break'>{content}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Message;
