import {
  ActionFunction,
  Form,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import { commitSession, getSession } from '~/sessions';

import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import styles from '~/components/Messenger/styles.css';
import { Card, CardHeader } from 'reactstrap';
import { Channel } from '~/messenger-types';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { getChannels } from '~/channelservice';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const {existingChannels} = await getChannels()

  return {channels: existingChannels}
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

  const formDataItems = await getFormDataItemsFromRequest(request, ['action', 'channel'])
  const {action} = formDataItems;

  if (action === 'Cancel') {
    return redirect('/messenger');
  } else {
    const {channel} = formDataItems

    await deleteChannel(channel);
    const activeChannel = await session.get('activeChannel');
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
    <Card
      style={{ width: '300px', float: 'right' }}
      className='d-flex align-items-center shadow mb-5 bg-body rounded'
    >
      <CardHeader className=' w-100 text-center py-4'>
        <h3 className='mb-4'>Delete Channel</h3>
        <Form method='post'>
          <div className='d-flex justify-content-between align-items-center row '>
            <div className='pb-4'>
              <label className='p-2 align-middle' id='activate'>
                Select Channel
              </label>
              <select
                name='channel'
                id='channel'
                className={`mt-1 align-middle`}
              >
                {channels.map((c: Channel) => {
                  const id = c.channelId.toString();
                  return (
                    <option key={id} value={id}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className='d-flex justify-content-between'>
              <button
                name='action'
                className='btn btn-secondary'
                value='Cancel'
                type='submit'
              >
                Cancel
              </button>
              <button 
                className='btn btn-primary'
                name='action' value='Delete' type='submit'>
                Delete
              </button>
            </div>
          </div>
        </Form>
      </CardHeader>
    </Card>
  );
};

export default DeleteChannel;
