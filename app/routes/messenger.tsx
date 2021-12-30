import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from 'remix';
import { commitSession, getSession } from '~/sessions';
import axios from 'axios';
import { env } from 'process';
import { Channel, ChannelMessage } from '~/messenger-types';
import Layout from '~/components/Layout';

import React from 'react';
import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import styles from '~/components/Messenger/styles.css';

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
  const formData = await request.formData();

  const channelId = formData.get('channelId');
  console.log({ channelId });

  session.set('activeChannelId', channelId);
  return redirect('/messenger/showchannel', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const res = await axios.get('https://localhost:5001/channels');
  const existingChannels = res.data;
  const existingMessages = await getChannelMessages(existingChannels);

  return {
    connection: startSignalRConnection(),
    loginUser: session.has('userId') ? await session.get('userId') : null,
    existingChannels,
    existingMessages,
  };
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

const Messenger = () => {
  const { existingChannels, existingMessages, loginUser, connection } =
    useLoaderData();
  const [clientConnection] = React.useState<HubConnection | null>(connection);

  return (
    <>
      <Layout
        existingChannels={existingChannels}
        existingMessages={existingMessages}
        loginUser={loginUser}
        clientConnection={clientConnection}
      >
        <Outlet />
      </Layout>
    </>
  );
};

export default Messenger;
