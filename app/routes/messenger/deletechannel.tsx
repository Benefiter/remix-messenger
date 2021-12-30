import {
  ActionFunction,
  Form,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import { commitSession, getSession } from '~/sessions';
import axios from 'axios';

import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import styles from '~/components/Messenger/styles.css';
import {
  Card,
  CardHeader,
} from 'reactstrap';
import { Channel } from '~/messenger-types';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const res = await axios.get('https://localhost:5001/channels');
  const channels = res.data;

  return {
    channels,
  };
};

const deleteChannel = async (channelId: string) => {
  const clientConnection: HubConnection = await startSignalRConnection();

  if (clientConnection) {
    clientConnection.invoke('RemoveChannel', Number(channelId)).finally(() => {
      console.log('stopping connection ********');
      stopSignalRConnection(clientConnection);
    });
  }
};

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();

  console.log({ formData });

  const action = formData.get('action');
  if (action === 'Cancel') {
    return redirect('/messenger');
  } else {
    const channel = formData.get('channel') as string;
    console.log({ channel });

    await deleteChannel(channel);
    const activeChannel = await session.get('activeChannel')
    if (channel === activeChannel) {
      session.set('activeChannel', '');
    }
    return redirect('/messenger', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
};

const DeleteChannel = () => {
  const { channels } = useLoaderData();

  return (
    <Card className='w-25 d-flex align-items-center'>
      <CardHeader>
        <h3>Delete Channel</h3>
        <Form method='post'>
          <h4 className='pe-2 pb-2'>Channel Name</h4>
          <label className='p-2 align-middle' id='activate'>
            Select Channel
          </label>

          <select name='channel' id='channel' className={`mt-1 align-middle`}>
            {channels.map((c: Channel) => {
              const id = c.channelId.toString();
              return (
                <option key={id} value={id}>
                  {c.name}
                </option>
              );
            })}
          </select>
          <button
            name='action'
            color='secondary'
            value='Cancel'
            type='submit'
          >
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

export default DeleteChannel;
