import footerStyles from '../../styles/Footer.module.css';
import React, { ChangeEvent } from 'react';
import { Row, Col } from 'reactstrap';
import MessengerButton from '../Buttons/MessengerButton';
import { ChannelMessage } from '~/messenger-types';
import {
  ActionFunction,
  Form,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from 'remix';
import styles from '~/styles/Footer.module.css';
import { getSession } from '~/sessions';
import { startSignalRConnection } from '~/services/signalR/signalrClient';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  const activeChannel = await session.get('activeChannel');
  const channelId = await session.get('activeChannelId');
  const user = await session.get('userId');

  console.log('Footer *****');
  console.log({ activeChannel, channelId });

  return {
    clientConnection: startSignalRConnection(),
    channelId,
    activeChannel,
    user,
  };
};

// const sendMessage = () => {
//   if (!clientConnection) return;

//   clientConnection
//     .invoke('AddChannelMessage', Number(channelId), {
//       channelId: Number(channelId),
//       author: user,
//       content: message,
//     })
//     .then((msg: ChannelMessage) => {
//       setMessage('');
//     });
// };

const Footer = () => {
  const { activeChannel } = useLoaderData();
  const [message, setMessage] = React.useState('');
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  React.useEffect(() => {
    const navbar = document.getElementById('navbar');
    setNavbarHeight(navbar?.offsetHeight ?? 0);
  }, []);

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

  return (
    <div
      //@ts-ignore 2339
      className={footerStyles.footer}
      style={{ minHeight: `calc(30vh - ${navbarHeight}px)` }}
    >
      <Row className='no-gutters m-0'>
        {activeChannel && (
          <Col sm='12' lg='6' className='ms-4'>
            <h4 className='pt-3'>Send Message On {activeChannel}</h4>

            <Form method='post'>
              <Row className='no-gutters'>
                <Col md='12' lg='10'>
                  <textarea
                    //@ts-ignore 2339
                    className={footerStyles.sendMessage}
                    value={message}
                    onChange={updateMessage}
                    name='message'
                  ></textarea>
                </Col>
                <Col className=' d-flex mt-4'>
                  <div className='d-flex align-items-start'>
                    <MessengerButton
                      // disabled={message === ''}
                      // className='btn btn-sm bg-primary primary mt-4 mb-2'
                      title='Send Message'
                      name='Send'
                      type='submit'
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        )}

        {/* <Col className='d-flex align-items-center flex-column'>
          <>
            <div className='pt-3 h4'>Board Status</div>
            <div className='stats p-3 fw-bold text-center'>
              There are {stats.activeChannels} active Channels
              <div className='pt-2 fs-6 fw-light'>{stats.lastMessageStat}</div>
            </div>
          </>
        </Col> */}
        {/* <Col
          lg='2'
          className={`${
            //@ts-ignore 2339
            footerStyles.footerButton
          } d-flex justify-content-end mt-4`}
        >
          <MessengerButton
            clickHandler={() => openInNewTab()}
            title='Start a new session in a new window'
            name='New Session'
          />
        </Col> */}
      </Row>
    </div>
  );
};

export default Footer;
