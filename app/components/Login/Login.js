import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMessengerProvider } from '../Context/MessengerContext';
import { Actions } from './../../reducers/message/actions';
import MessengerButton from './../Buttons/MessengerButton';

const Login = () => {
  const [name, setName] = useState('');
  const { dispatch } = useMessengerProvider();
  const router = useRouter();

  const invalidName = () => {
    return name === '';
  };

  const setUserName = (name) => {
    dispatch({ type: Actions.setUser, payload: { user: name } });
    router.push('/main');
  }

  return (
    <div
      className='d-flex align-items-center justify-content-center'
      style={{ height: '100vh' }}
    >
      <div
        className='card bg-info border border-2 border-dark p-4 shadow-lg '
        style={{ width: `20rem` }}
      >
        <div className='card-body'>
          <form
            onSubmit={e => {
              e.preventDefault();
              setUserName(name);
            }}
          >
            <h4 className='pb-2 text-center'>Login</h4>
            <input
              autoFocus
              className='w-100'
              type='text'
              placeholder='Enter name for messaging'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className='text-center'>
              <MessengerButton
                disabled={invalidName()}
                type='submit'
                className='mt-4'
                name='OK'
                color='primary'
              />
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login
