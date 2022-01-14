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
          <input readOnly hidden name='messageID' value={`${messageId},${channelId}`} />
          <div className='d-flex row'>
            <div className='d-flex col justify-content-between'>
              <div className=''>{`Sender: ${author}`}</div>
              <button
                name='remove'
                title='Delete'
                className={`${iconClass}`}
              >
                <i className='bi-x-lg' />
              </button>
            </div>
            <div>{`Received: ${moment(createdOn).format(
              'MMM DD YYYY hh:mm:ss a'
            )}`}</div>
          </div>
          <div className='message-content'>
            <div className='p-2 text-break'>{content}</div>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Message;
