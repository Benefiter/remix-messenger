import { Channel } from '~/messenger-types';
import { Form, Link, LinksFunction, useSubmit } from 'remix';
import styles from '~/components/Messenger/styles.css';
import { ebProps } from '~/root';

type ChannelAdminProps = {
  channels: Channel[];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const ChannelAdmin = ({ channels }: ChannelAdminProps) => {
  const submit = useSubmit();
  const hasChannels = channels?.length > 0;

  return (
    <>
      {!hasChannels ? (
        <div className='pe-2 '>
          Please add a channel <i className='bi-arrow-bar-right' />
        </div>
      ) : (
        <Form method='post'>
          <div className='d-flex text-center justify-content-between align-items-center px-4'>
            <div className='d-flex px-4 align-items-center'>
              <label className='p-2 align-middle' id='activate'>
                Channels:
              </label>

              <select
                style={{ height: 'max-content' }}
                name='channel'
                id='channel'
                className={`form-select text-center align-middle`}
              >
                {channels.map((c: Channel) => {
                  const id = c.channelId.toString();
                  return (
                    <option key={id} value={[id, c.name]}>
                      {c.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className='btn btn-primary' type='submit'>
              Select
            </button>
          </div>
        </Form>
      )}
      <Link
        className='navbar-link btn btn-primary'
        style={{ marginRight: '10px' }}
        to='addchannel'
      >
        Add Channel
      </Link>
      {hasChannels && (
        <Link className='navbar-link btn btn-primary' to='deletechannel'>
          Delete Channel
        </Link>
      )}
        <Link className='btn btn-primary' to='logout'>
          <i className='bi-box-arrow-right' />
        </Link>
    </>
  );
};

export const ErrorBoundary = ({ error }: ebProps) => {
  return (
    <>
      <h1>Error</h1>
      {Array.isArray(error) ? error.map(e => <p>e</p>) : <p>{error}</p>}
    </>
  );
};

export default ChannelAdmin;
