import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  redirect,
  useActionData,
  useSubmit,
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
  const submit = useSubmit();

  return (
    <Card
      style={{ width: '400px', float: 'right' }}
      className='d-flex align-items-center shadow mb-5 bg-body rounded'
    >
      <CardHeader className=' w-100 text-center py-4'>
        <h3 className='mb-4'>Create Channel</h3>
        <Form method='post' action='/messenger/addchannel'>
          <div className='d-flex justify-content-between align-items-center row '>
            <div className='pb-4'>
              <label className='p-2 align-middle' id='activate'>
                Channel Name:
              </label>{' '}
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
            <div className='d-flex justify-content-evenly'>
              <Link className='navbar-link btn btn-primary' to='/messenger/showchannel'>
                Cancel
              </Link>

              <button
                className='btn btn-primary'
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
