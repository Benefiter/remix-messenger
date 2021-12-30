import { Channel, ChannelMessage } from '~/messenger-types';
import { HubConnection } from '@microsoft/signalr';
import {
  Form,
  Link,
  LinksFunction,
  Outlet,
  ActionFunction,
  redirect,
} from 'remix';
import styles from '~/components/Messenger/styles.css';
import { commitSession, getSession } from '~/sessions';
import { ebProps } from '~/root';

type ChannelAdminProps = {
  existingChannels: Channel[];
  existingMessages: ChannelMessage[];
  connection: HubConnection | null;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};


const ChannelAdmin = ({
  existingChannels,
}: ChannelAdminProps) => {
  return (
    <>
      {existingChannels?.length === 0 ? (
        <div>Please create a channel</div>
      ) : (
        <Form method='post'>
          <label className='p-2 align-middle' id='activate'>
            Select Channel
          </label>

          <select
            name='channelId'
            id='channelId'
            className={`mt-1 align-middle`}
          >
            {existingChannels.map((c: Channel) => {
              const id = c.channelId.toString();
              return (
                <option key={id} value={id}>
                  {c.name}
                </option>
              );
            })}
          </select>
          <button color='primary' type='submit'>
            Show
          </button>
        </Form>
      )}
      <Link
        className='navbar-link'
        style={{ marginRight: '10px' }}
        to='addchannel'
      >
        Add Channel
      </Link>
      <Link className='navbar-link' to='deletechannel'>
        Delete Channel
      </Link>
    </>
  );
};

export const ErrorBoundary = ({ error }: ebProps) => {
  return (
    <>
      <h1>Error</h1>
      <p>{error}</p>
    </>
  );
};

export default ChannelAdmin;
