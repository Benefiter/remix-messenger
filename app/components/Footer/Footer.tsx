import footerStyles from '../../styles/Footer.module.css';
import React, { ChangeEvent } from 'react';
import { Row, Col } from 'reactstrap';
import { useMessengerProvider } from '../Context/MessengerContext';
import { Actions } from '../../reducers/message/actions';
import MessengerButton from '../Buttons/MessengerButton';
import { ChannelMessage } from '~/messenger-types';

const Footer = () => {
  const { state, dispatch, connected } = useMessengerProvider();
  const [message, setMessage] = React.useState('');
  const [navbarHeight, setNavbarHeight] = React.useState(0);
  const { activeChannel, activeChannelId, clientConnection, user, stats } =
    state;

  React.useEffect(() => {
    const navbar = document.getElementById('navbar');
    setNavbarHeight(navbar?.offsetHeight ?? 0);
  }, []);

  const updateMessage = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(e.target.value);

  const sendMessage = () => {
    if (!connected) return;

    clientConnection
      .invoke('AddChannelMessage', Number(activeChannelId), {
        channelId: Number(activeChannelId),
        author: user,
        content: message,
      })
      .then((msg: ChannelMessage) => {
        dispatch && dispatch({
          type: Actions.updateChannelMessages,
          payload: { messages: [msg] },
        });
        setMessage('');
      });
  };

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
            <Row className='no-gutters'>
              <Col md='12' lg='10'>
                <h4 className='pt-3'>Send Message On {activeChannel}</h4>

                <textarea
                  //@ts-ignore 2339
                  className={footerStyles.sendMessage}
                  value={message}
                  onChange={updateMessage}
                ></textarea>
              </Col>
              <Col className=' d-flex mt-4'>
                <div className='d-flex align-items-start'>
                  <MessengerButton
                    disabled={message === ''}
                    // className='btn btn-sm bg-primary primary mt-4 mb-2'
                    clickHandler={sendMessage}
                    title='Send Message'
                    name='Send'
                  />
                </div>
              </Col>
            </Row>
          </Col>
        )}

        <Col className='d-flex align-items-center flex-column'>
          <>
            <div className='pt-3 h4'>Board Status</div>
            <div className='stats p-3 fw-bold text-center'>
              There are {stats.activeChannels} active Channels
              <div className='pt-2 fs-6 fw-light'>{stats.lastMessageStat}</div>
            </div>
          </>
        </Col>
        <Col
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
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
