import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import { Channel } from '~/messenger-types';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import {
  getSessionActiveChannelAndId,
  setSessionActiveChannel,
} from '~/utils/session.server';
import { removeChannel, getAllChannels } from '~/utils/messenger.server';
import dialogStyles from '@reach/dialog/styles.css';
import ModalDialog from '~/components/Modal/ModalDialog';
import ModalDialogButtons from '~/components/Modal/ModalDialogButtons';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: dialogStyles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { channels } = await getAllChannels();

  return { channels: channels };
};

export const action: ActionFunction = async ({ request }) => {
  const formDataItems = await getFormDataItemsFromRequest(request, [
    'channel',
  ]);

  const { channel } = formDataItems;

  await removeChannel({ channelId: channel });
  const { activeChannel, channelId } = await getSessionActiveChannelAndId(request);
  return await setSessionActiveChannel(
    request,
    channel === channelId ? '' : activeChannel.toString()
  );
};

const DeleteChannel = () => {
  const { channels } = useLoaderData();
  return (
    <ModalDialog modalTitle='Delete Channel'>
      <Form method='post' action='/messenger/deletechannel'>
        <div className='py-2 mx-auto fs-6'>
          <label className='pe-4 align-middle' id='activate'>
            Select Channel
          </label>
          <select
            name='channel'
            id='channel'
            className={`mt-1 align-middle`}
          >
            {channels.map((c: Channel) => {
              const id = c.channelId.toString();
              return (
                <option key={id} value={id}>
                  {c.name}
                </option>
              );
            })}
          </select>
        </div>
        <ModalDialogButtons operationTitle='Delete' />
      </Form>
    </ModalDialog>
  );
};

export default DeleteChannel;
