import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { ChannelMessage } from '~/messenger-types';
import { Form, useSubmit } from 'remix';
import { MouseEvent } from 'react';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

type MessageProps = {
  message: ChannelMessage;
  user: string;
};

const Message = ({ message, user }: MessageProps) => {
  console.log('*****MESSSAGE')
  console.log(message)
  const { author, content, createdOn, messageId, channelId } = message;
  console.log(`${messageId},${channelId}`)
  const submit = useSubmit();

  const iconClass = author === user ? 'enable-delete' : 'disable-delete';

  // const handleDelete = (
  //   event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  // ) => {
  //   submit({ method: 'post', name: `${messageId},${channelId}` });
  // };

  return (
    <Card className='m-2'>
      <CardBody>
        <Form method='post'>
          <button
            name='action'
            value={`${messageId},${channelId}`}
            title='Delete'
            className={`${iconClass}`}
          >
            <i className='bi-x-lg d-flex justify-content-end' />
          </button>
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
