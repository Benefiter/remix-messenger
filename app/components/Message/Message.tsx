import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { ChannelMessage } from '~/messenger-types';
import { Form } from 'remix';

type MessageProps = {
  message: ChannelMessage;
  user: string;
};

const Message = ({ message, user }: MessageProps) => {
  const { author, content, createdOn, messageId, channelId } = message;
  const iconClass = author === user ? 'enable-delete' : 'disable-delete';

  return (
    <Card className='m-2'>
      <CardBody>
        <Form method='post'>
          <button
            name='remove'
            // value={`${messageId},${channelId}`}
            // title='Delete'
            className={`${iconClass}`}
          >
            <i className='bi-x-lg d-flex justify-content-end' />
          </button>
          <input readOnly hidden name='messageID' value={`${messageId},${channelId}`}/>
        </Form>
        <div className='message-header'>
          <div className=''>{`Sender: ${author}`}</div>
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
