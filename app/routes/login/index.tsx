import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useTransition,
} from 'remix';
import type { LoaderFunction } from 'remix';
import { getPost } from '~/posts';
import invariant from 'tiny-invariant';
import React from 'react';
import { commitSession, getSession } from '~/sessions';

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

  console.log('THE USER');
  console.log(user);

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
