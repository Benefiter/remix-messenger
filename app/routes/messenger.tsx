import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from 'remix';
import { env } from 'process';
import Layout from '~/components/Layout';

import {
  startSignalRConnection,
  stopSignalRConnection,
} from '~/services/signalR/signalrClient';
import styles from '~/components/Messenger/styles.css';
import { getChannels, getMessagesForChannels } from '~/channelservice';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { Channel, ChannelMessage } from '~/messenger-types';
import { ebProps } from '~/root';
import { getSessionActiveChannelAndId, getUser, setSessionActiveChannelAndId } from '~/utils/session.server';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

type SendMesasgeArgs = {
  message: string;
  channelId: string;
  user: string | undefined;
};

const sendMessage = async ({
  message,
  channelId,
  user,
}: SendMesasgeArgs) => {
  const clientConnection = await startSignalRConnection();

  if (
    !clientConnection ||
    clientConnection.state != HubConnectionState.Connected
  )
    return;

  clientConnection
    .invoke('AddChannelMessage', Number(channelId), {
      channelId: Number(channelId),
      author: user ?? 'unkown',
      content: message,
    })
    .then(msg => {
      stopSignalRConnection(clientConnection);
    });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)

  const formDataItems = await getFormDataItemsFromRequest(request, [
    'channel',
    'message',
  ]);

  const { channel, message } = formDataItems;

  console.log('MESSENGEr ActionFunction');
  console.log({channel, message});
  
  const channelData = channel?.split(',');

  if (message != null) {
    await sendMessage({
      message,
      channelId: channelData[0],
       user: user?.username,
    });
    return redirect('/messenger/showchannel');
  }

  return await setSessionActiveChannelAndId(request, channelData)
};

export const loader: LoaderFunction = async ({ request }) => {

  console.log('Messenger Loader ');
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const { channels } = await getChannels();
  const { messages, error } = await getMessagesForChannels(channels);

  const {activeChannel, channelId} = await getSessionActiveChannelAndId(request)
  const user = await getUser(request);

  return {
    loginUser: user?.username ?? 'unknown',
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
