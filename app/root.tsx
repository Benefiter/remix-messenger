import {
  Form,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  LinksFunction
} from 'remix';
import type { MetaFunction } from 'remix';
import { env } from 'process';
import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";
import { userloggedIn } from './utils/session.server';

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)"
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)"
    }
  ];
};

export const meta: MetaFunction = () => {
  return { title: 'New Remix App' };
};

export const loader: LoaderFunction = async ({ request }) => {
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  try {
    return {
      userLoggedIn: await userloggedIn(request),
      error: null,
    };
  } catch (errors) {
    return {
      errors,
    };
  }
};

export default function App() {
  const { userLoggedIn, errors } = useLoaderData();

  if (errors) {
    return (
      <>
        {' '}
        <h1>Error</h1>
        <p>{errors}</p>
      </>
    );
  }

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
          {!userLoggedIn && (
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
                <li>
                  <Form action='/test' method='post'>
                    <button className='btn btn-primary' type='submit'>Test</button>
                  </Form>
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
  return (
    <>
      <h1>Error</h1>
      {Array.isArray(error) ? error.map(e => <p>e</p>) : <p>{error}</p>}
    </>
  );
};
