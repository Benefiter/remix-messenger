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

import styles from '~/components/Messenger/styles.css';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { Channel, ChannelMessage } from '~/messenger-types';
import { ebProps } from '~/root';
import {
  getSessionActiveChannelAndId,
  getUserName,
  setSessionActiveChannelAndId,
} from '~/utils/session.server';
import { addMessage, getAllChannels, getMessagesForChannels } from '~/utils/messenger.server';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserName(request);

  const formDataItems = await getFormDataItemsFromRequest(request, [
    'channel',
    'message',
    'logoutuser'
  ]);

  const { channel, message,logoutuser } = formDataItems;


  console.log('MESSENGEr ActionFunction');
  console.log({ channel, message, logoutuser });

  const channelData = channel?.split(',');

  if (message != null && user != null) {
    await addMessage({
      content: message,
      channelId: channelData[0],
      author: user,
    });
    return redirect('/messenger/showchannel');
  }

  return await setSessionActiveChannelAndId(request, channelData);
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log('Messenger Loader ');
  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const { channels } = await getAllChannels();
  console.log('messenger LoadFunction');
  console.log('channels')
  console.log({channels});

  const { messages, error } = await getMessagesForChannels(channels);
  console.log('messages for channels');
  console.log({messages});

  const { activeChannel, channelId } = await getSessionActiveChannelAndId(
    request
  );
  const user = await getUserName(request);

  return {
    loginUser: user,
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
