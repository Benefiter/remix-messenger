import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  useActionData,
} from 'remix';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { setSessionActiveChannel } from '~/utils/session.server';
import { addChannel } from '~/utils/messenger.server';
import dialogStyles from '@reach/dialog/styles.css';
import ModalDialog from '~/components/Modal/ModalDialog'
import ModalDialogButtons from '~/components/Modal/ModalDialogButtons';

type PostAddChannelFormError = {
  channel?: boolean;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: dialogStyles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await getFormDataItemsFromRequest(request, [
    'channel',
  ]);

  const { channel } = formData;
  const errors: PostAddChannelFormError = {};
  if (channel == null || channel === '') errors.channel = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  await addChannel({ name: channel });

  return setSessionActiveChannel(request, channel)
};

const AddChannel = () => {
  const errors = useActionData();
  return (
    <>
      <ModalDialog modalTitle='Add Channel'>
        <Form method='post' action='/messenger/addchannel'>
            <div className='py-4 d-flex align-items-center'>
              <label className='pe-2' id='activate'>
                Channel:
              </label>
              <input
                style={{ color: 'black' }}
                autoFocus
                type='text'
                placeholder='Enter Channel Name'
                name='channel'
              />
              {errors?.channel && (
                <div className='text-danger'>Please enter a channel name</div>
              )}
            </div>
            <ModalDialogButtons operationTitle='Create' />
        </Form>
      </ModalDialog>
    </>
  );
};

export default AddChannel;
