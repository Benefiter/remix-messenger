import React, { ChangeEvent } from 'react';
import { Row, Col } from 'reactstrap';
import MessengerButton from '../Buttons/MessengerButton';
import { Form, LinksFunction, LoaderFunction, useLoaderData, useSubmit, useTransition } from 'remix';
import styles from '~/components/Messenger/styles.css';
import { getSessionActiveChannelAndId } from '~/utils/session.server';
export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { activeChannel, channelId } = await getSessionActiveChannelAndId(request)

  return {
    channelId,
    activeChannel,
  };
};

const Footer = () => {
  const { channelId, activeChannel } = useLoaderData();
  const [message, setMessage] = React.useState('');
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  const submit = useSubmit();
  const transition = useTransition();
  const submitting = transition.state === 'submitting'
  
  React.useEffect(() => {
    const navbar = document.getElementById('navbar');
    setNavbarHeight(navbar?.offsetHeight ?? 0);
  }, []);

  React.useEffect(() => {
    setMessage('')
  }, [channelId]);

  const updateMessage = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  const openInNewTab = () => {
    const newWindow = window.open(
      window.location.origin,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleSend = (e: { currentTarget: HTMLButtonElement | HTMLFormElement | HTMLInputElement | FormData | URLSearchParams | { [name: string]: string; } | null; }) => {
      const formElement = document.getElementById('SendMessageForm') as HTMLFormElement
      setMessage('')
      submit(formElement, { replace: true });
  }

  return (
    <div
      className='footer'
      style={{ minHeight: `calc(30vh - ${navbarHeight}px)` }}
    >
      <Row className='no-gutters m-0'>
        {activeChannel && (
          <Col sm='12' lg='6' className='ms-4'>
            <h4 className='pt-3'>Send Message On {activeChannel}</h4>

            <Form id='SendMessageForm' method='post'>
              <Row className='no-gutters'>
                <Col md='12' lg='10'>
                  <textarea
                    disabled={submitting}
                    //@ts-ignore 2339
                    className='sendMessage'
                    value={message}
                    onChange={updateMessage}
                    name='message'
                  ></textarea>
                  <input readOnly hidden name='channel' value={`${channelId},${activeChannel}`} />
                </Col>
                <Col className=' d-flex mt-4'>
                  <div className='d-flex align-items-start'>
                    <MessengerButton
                      disabled={message === '' || submitting}
                      title='Send Message'
                      name='Send'
                      type='submit'
                      clickHandler={handleSend}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Footer;
