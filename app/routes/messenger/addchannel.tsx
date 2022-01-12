import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  useActionData,
  useNavigate,
} from 'remix';
import { getFormDataItemsFromRequest } from '~/request-form-data-service';
import { setSessionActiveChannel } from '~/utils/session.server';
import { addChannel } from '~/utils/messenger.server';
import { Dialog } from '@reach/dialog';
import dialogStyles from '@reach/dialog/styles.css';
import VisuallyHidden from '@reach/visually-hidden';


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
  const navigate = useNavigate();

  const close = () => navigate(-1)
  return (
    <>
      <Dialog isOpen={true} onDismiss={close} aria-labelledby="modal-title">
        <div className="d-flex">
          <h3 id="modal-title">Create Channel</h3>
          <button className="close-button ms-auto " onClick={close}>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden><i className='bi-x' /></span>
          </button>
        </div>
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
              <Link className='navbar-link btn btn-primary' to='/messenger'>
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
      </Dialog>
    </>
  );
};

export default AddChannel;
