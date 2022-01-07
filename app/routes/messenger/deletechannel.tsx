import {
  ActionFunction,
  Form,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import styles from '~/components/Messenger/styles.css';
import { Card, CardHeader } from 'reactstrap';
import { Channel } from '~/messenger-types';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import {
  getSessionActiveChannel,
  setSessionActiveChannel,
} from '~/utils/session.server';
import { removeChannel, getAllChannels } from '~/utils/messenger.server';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { channels } = await getAllChannels();

  return { channels: channels };
};

export const action: ActionFunction = async ({ request }) => {
  const formDataItems = await getFormDataItemsFromRequest(request, [
    'action',
    'channel',
  ]);
  const { action } = formDataItems;

  if (action === 'Cancel') {
    return redirect('/messenger');
  } else {
    const { channel } = formDataItems;

    await removeChannel({channelId: channel});
    const activeChannel = await getSessionActiveChannel(request);
    return await setSessionActiveChannel(
      request,
      channel === activeChannel ? '' : activeChannel.toString()
    );
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
                name='action'
                value='Delete'
                type='submit'
              >
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
