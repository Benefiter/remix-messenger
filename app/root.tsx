import {
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from 'remix';
import type { MetaFunction } from 'remix';
import { getSession } from './sessions';
import { env } from 'process';
import axios from 'axios';
import { Channel } from './messenger-types';

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  session.get('userId');

  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  try {
    const res = await axios.get('https://localhost:5001/channels');
    const existingChannels = res.data;

    const existingMessages = await getChannelMessages(existingChannels);

    const user = session.has('userId') ? await session.get('userId') : null;

    return {
      user,
      existingChannels,
      existingMessages,
    };
  } catch (error) {
    console.log('In catch of catch-try');
    console.log({ error });
    return {
      error,
    };
  }
};

const getChannelMessages = async (channels: Channel[]) => {
  return Promise.all(
    channels.map(async c => {
      let resp;
      resp = await axios.get(
        `https://localhost:5001/channels/${c.channelId}/messages`
      );
      return resp?.data;
    })
  ).then(results =>
    results.reduce((prev, cur) => {
      return [...prev, ...cur];
    }, [])
  );
};

export default function App() {
  const { user, error } = useLoaderData();

  if (error) {
    return (
      <>
        {' '}
        <h1>Error</h1>
        <p>{error}</p>
      </>
    );
  }

  const hasUser = user !== null;
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
          crossOrigin='anonymous'
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css'
        />
      </head>
      <body>
        <>
          {!hasUser && (
            <>
              <ul>
                <li>
                  <Link style={{ margin: '5px' }} to='/posts'>
                    Posts
                  </Link>
                </li>
                <li>
                  <Link style={{ margin: '5px' }} to='/admin'>
                    Admin
                  </Link>
                </li>
                <li>
                  <Link style={{ margin: '5px' }} to='/login'>
                    Messenger Login
                  </Link>
                </li>
              </ul>
            </>
          )}
          <Outlet />
        </>
        <ScrollRestoration />
        {/* <Scripts /> */}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export type ebProps = {
  error: string | Array<string>;
};

export const ErrorBoundary = ({ error }: ebProps) => {
  console.log('ErrorBoundary');
  console.log({ error });
  return (
    <>
      <h1>Error</h1>
      {Array.isArray(error) ? error.map(e => <p>e</p>) : <p>{error}</p>}
    </>
  );
};
