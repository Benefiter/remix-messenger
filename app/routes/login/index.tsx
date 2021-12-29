import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useTransition,
  LoaderFunction
} from 'remix';
import invariant from 'tiny-invariant';
import React from 'react';
import { commitSession, getSession } from '~/sessions';
import { startSignalRConnection } from './../../services/signalR/signalrClient';
import { Actions } from '~/reducers/message/actions';
import { useMessengerProvider } from '~/components/Context/MessengerContext';

type LoginName = {
  user: string | undefined;
};

export type LoginFormError = {
  user?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();

  const user = formData.get('user');

  const errors: LoginFormError = {};
  if (!user) errors.user = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof user === 'string');

  session.set('userId', user);
  console.log('session after setting suerId');
  session.get('userId');
  console.log('session had userId');
  console.log(session.has('userId'))

  return redirect('/messenger', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function Index() {
  const [userName, setUserName] = React.useState<LoginName>({ user: '' });
  const errors = useActionData();
  const transition = useTransition();
  const { dispatch, connected } = useMessengerProvider();

  // if (connected && !connected()){
  //   const clientConnection = startSignalRConnection() 

  //   console.log('*****About to set client connection in login form')
  //   console.log({clientConnection})
  //   dispatch && dispatch({
  //     type: Actions.setClientConnection,
  //     payload: { clientConnection},
  //   });
  // }
  // console.log('Login Index');
  // console.log({dispatch})

  React.useEffect(() => {
    console.log('*****In useEffect for MainLayout for userName')
    if (userName.user === '') return;

    const clientConnection = startSignalRConnection() 

    console.log('*****About to set client connection in login form')
    console.log({clientConnection})
    dispatch && dispatch({
      type: Actions.setClientConnection,
      payload: { clientConnection},
    });

    // return () => stopSignalRConnection(clientConnection)
  },[userName])

  return (
    <Form method='post'>
      <p>
        <label>
          User Name: {errors?.title ? <em>User Name is required</em> : null}
          <input
            value={userName.user}
            onChange={e => setUserName({ ...userName, user: e.target.value })}
            type='text'
            name='user'
          />
        </label>
      </p>
      <p>
        <button type='submit'>
          {transition.submission ? 'Logging In...' : 'Login '}
        </button>
      </p>
    </Form>
  );
}
