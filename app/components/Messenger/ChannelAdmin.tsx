import { Channel } from '~/messenger-types';
import { Form, Link, LinksFunction } from 'remix';
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
  const hasChannels = channels?.length > 0;

  return (
    <>
      {!hasChannels ? (
        <div className='pe-2 '>
          Please add a channel <i className='bi-arrow-bar-right' />
        </div>
      ) : (
        <Form method='post'>
          <div className='d-flex text-center  align-items-center px-4'>
            <div className='d-flex px-4 align-items-center'>
              <label className='p-2 fs-5 align-middle' id='activate'>
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
        className='navbar-link btn btn-primary text-decoration-none'
        style={{ marginRight: '10px', width: '200px'}}
        to='addchannel'
      >
        Add Channel
      </Link>
      {hasChannels && (
        <Link style={{width: '200px'}} className='navbar-link btn btn-primary text-decoration-none' to='deletechannel'>
          Delete Channel
        </Link>
      )}
        <Link className='btn btn-primary ms-2' to='logout' title='Logout'>
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
