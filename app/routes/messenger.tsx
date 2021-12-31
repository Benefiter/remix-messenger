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

import { startSignalRConnection, stopSignalRConnection } from '~/services/signalR/signalrClient';
import styles from '~/components/Messenger/styles.css';
import { getChannels, getMessagesForChannels } from '~/channelservice';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { Channel, ChannelMessage } from '~/messenger-types';
import { ebProps } from '~/root';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

type SendMesasgeArgs = {
  clientConnection: HubConnection;
  message: string;
  channelId: string;
  user: string;
};

const sendMessage = ({
  clientConnection,
  message,
  channelId,
  user,
}: SendMesasgeArgs) => {
  if (
    !clientConnection ||
    clientConnection.state != HubConnectionState.Connected
  )
    return;

  clientConnection
    .invoke('AddChannelMessage', Number(channelId), {
      channelId: Number(channelId),
      author: user,
      content: message,
    })
    .then(msg => {
      console.log('SENT MESSAGE')
      stopSignalRConnection(clientConnection)
    })
};

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  const activeChannelId = await session.get('activeChannelId');
  const user = await session.get('userId');

  const formDataItems = await getFormDataItemsFromRequest(request, [
    'channel',
    'message'
  ]);

  const { channel, message } = formDataItems;

  if (message != null) {
    const clientConnection = await startSignalRConnection();
    sendMessage({ clientConnection, message, channelId: activeChannelId, user });
    return redirect('/messenger/showchannel');
  }

  const channelData = channel?.split(',');

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

  const { channels } = await getChannels();
  const { messages, error } = await getMessagesForChannels(channels);

  const activeChannel = await session.get('activeChannel');
  const channelId = await session.get('activeChannelId');

  return {
    connection: startSignalRConnection(),
    loginUser: session.has('userId') ? await session.get('userId') : null,
    channels: channels,
    messages,
    error,
    channelId,
    activeChannel,
  };
};

export type SessionState = {
  channels: Channel[];
  messages: ChannelMessage[];
  loginUser: string;
  clientConnection: HubConnection | null;
  channelId: string;
  activeChannel: string;
};

const Messenger = () => {
  const sessionState: SessionState = useLoaderData();

  return (
    <>
      <Layout sessionState={sessionState}>
        <Outlet />
      </Layout>
    </>
  );
};
export const ErrorBoundary = ({ error }: ebProps) => {
  return (
    <>
      <h1>Messenger Error</h1>
      {Array.isArray(error) ? error.map(e => <p>e</p>) : <p>{error}</p>}
    </>
  );
};

export default Messenger;
