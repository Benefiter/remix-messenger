import { ActionFunction, Form, LinksFunction, redirect } from 'remix';
import { commitSession, getSession } from '~/sessions';

import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import styles from '~/components/Messenger/styles.css';
import { Card, CardHeader } from 'reactstrap';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const addChannel = async (channel: string) => {
  const clientConnection: HubConnection = await startSignalRConnection();

  if (clientConnection) {
    clientConnection.invoke('AddChannel', { name: channel }).finally(() => {
      stopSignalRConnection(clientConnection);
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();

  const action = formData.get('action');
  if (action === 'Cancel') {
    return redirect('/messenger');
  } else {
    const channel = formData.get('channel') as string;

    await addChannel(channel);

    session.set('activeChannel', channel);
    return redirect('/messenger', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
};

const AddChannel = () => {
  return (
    <Card className='w-25 d-flex align-items-center'>
      <CardHeader>
        <h3>Create Channel</h3>
        <Form method='post'>
          <h4 className='pe-2 pb-2'>Channel Name</h4>
          <input
            autoFocus
            className='w-100'
            type='text'
            placeholder='Enter Channel Name'
            name='channel'
          />
          <button name='action' color='secondary' value='Cancel' type='submit'>
            Cancel
          </button>
          <button
            color='primary'
            name='action'
            value='OK'
            type='submit'
          >
            OK
          </button>
        </Form>
      </CardHeader>
    </Card>
  );
};

export default AddChannel;
