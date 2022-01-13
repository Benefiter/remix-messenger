import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from 'remix';
import Layout from '~/components/Layout';
import styles from '~/components/Messenger/styles.css';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { Channel, ChannelMessage } from '~/messenger-types';
import {
  getSessionActiveChannelAndId,
  getUserName,
  setSessionActiveChannelAndId,
} from '~/utils/session.server';
import { addMessage, getAllChannels, getMessagesForChannels, removeMessage } from '~/utils/messenger.server';

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
    'dbChange',
    'messageID'
  ]);

  const { channel, message, dbChange, messageID } = formDataItems;

  if (messageID) {
    const actionData = messageID?.split(',');
    const messageId = actionData[0];
  
    if (messageId != null) {
      removeMessage({ messageId });
      return redirect('/messenger/showchannel');
    }
  }
  
  if (dbChange === 'true')     return redirect('/messenger/showchannel');

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
  
  const { channels } = await getAllChannels();

  const { messages, error } = await getMessagesForChannels(channels);
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

  // React.useEffect(() => {
  //   console.log('Messenger useEffect called')
  //   const timerId = setInterval(() => {
  //     fetcher.submit({dbChange: 'true'}, {method: 'post'});
  //   }, 5000);

  //   return () => {clearInterval(timerId)}
  // },[])

  return (
    <>
      <Layout sessionState={sessionState}>
        <Outlet />
      </Layout>
    </>
  );
};

export function ErrorBoundary({ error }: any) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

export default Messenger;
