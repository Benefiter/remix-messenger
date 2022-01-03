import {
  ActionFunction,
  Form,
  LinksFunction,
  redirect,
  useActionData,
} from 'remix';
import styles from '~/components/Messenger/styles.css';
import { Card, CardHeader } from 'reactstrap';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { setSessionActiveChannel } from '~/utils/session.server';
import { addChannel } from '~/utils/messenger.server';

type PostAddChannelFormError = {
  channel?: boolean;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await getFormDataItemsFromRequest(request, [
    'action',
    'channel',
  ]);

  const { action, channel } = formData;
  if (action === 'Cancel') {
    return redirect('/messenger');
  } else {
    const errors: PostAddChannelFormError = {};
    if (channel == null || channel === '') errors.channel = true;

    if (Object.keys(errors).length) {
      return errors;
    }

    await addChannel({name: channel});

    return setSessionActiveChannel(request, channel)
  }
};

const AddChannel = () => {
  const errors = useActionData();

  return (
    <Card
      style={{ width: '400px', float: 'right' }}
      className='d-flex align-items-center shadow mb-5 bg-body rounded'
    >
      <CardHeader className=' w-100 text-center py-4'>
        <h3 className='mb-4'>Create Channel</h3>
        <Form method='post'>
          <div className='d-flex justify-content-between align-items-center row '>
            <div className='pb-4'>
              <label className='p-2 align-middle' id='activate'>
                Channel Name:
              </label>{' '}
              <input
                autoFocus
                type='text'
                placeholder='Enter Channel Name'
                name='channel'
              />
              {errors?.channel && (
                <div className='text-danger'>Please enter a channel name</div>
              )}
            </div>
            <div className='d-flex justify-content-evenly'>
              <button
                name='action'
                className='btn btn-secondary'
                value='Cancel'
                type='submit'
              >
                Cancel
              </button>
              <button
                className='btn btn-primary'
                name='action'
                value='Create'
                type='submit'
              >
                Create
              </button>
            </div>
          </div>
        </Form>
      </CardHeader>
    </Card>
  );
};

export default AddChannel;
