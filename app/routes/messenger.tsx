import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from 'remix';
import { commitSession, getSession } from '~/sessions';
import { env } from 'process';
import Layout from '~/components/Layout';

import React from 'react';
import { startSignalRConnection } from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import styles from '~/components/Messenger/styles.css';
import { getChannels, getMessagesForChannels } from '~/channelservice';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  const formDataItems = await getFormDataItemsFromRequest(request, ['channel']);

  const { channel } = formDataItems;
  const channelData = channel?.split(',');
  console.log('DATA****');
  console.log(channelData);

  session.set('activeChannelId', channelData[0]);
  session.set('activeChannel', channelData[1]);
  return redirect('/messenger/showchannel', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const {existingChannels} = await getChannels()
  const {existingMessages, error} = await getMessagesForChannels(existingChannels);
  const messages = error == null ? existingMessages : [];

  return {
    connection: startSignalRConnection(),
    loginUser: session.has('userId') ? await session.get('userId') : null,
    existingChannels,
    messages,
    error,
  };
};

const Messenger = () => {
  const { existingChannels, messages, loginUser, connection } =
    useLoaderData();
  const [clientConnection] = React.useState<HubConnection | null>(connection);

  return (
    <>
      <Layout
        existingChannels={existingChannels}
        existingMessages={messages}
        loginUser={loginUser}
        clientConnection={clientConnection}
      >
        <Outlet />
      </Layout>
    </>
  );
};

export default Messenger;
