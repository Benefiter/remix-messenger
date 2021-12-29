import { Container, Row } from 'reactstrap';
// import '../../styles.css'
import React from 'react'
import { messageAddedCallbackWrapper, messageDeletedCallbackWrapper } from './../Messenger/messengerHelper';
import { useMessengerProvider } from '../Context/MessengerContext';
import { Actions } from './../../reducers/message/actions';
import ActiveChannel from './../ActiveChannel/ActiveChannel';
import Footer from './../Footer/Footer';
import { stopSignalRConnection } from '../../services/signalR/signalrClient'

const MainLayout = () => {
  const { state, dispatch, connected } = useMessengerProvider();

  const { clientConnection, channels, stats } = state;

  const subscribeToChannelMessageUpdates = channelId => {
    if (connected()) {

      clientConnection.invoke('SubscribeToMessageChannel', channelId);

      clientConnection.on('messageAdded', messageAddedCallbackWrapper(dispatch));

      clientConnection.on('messageDeleted', messageDeletedCallbackWrapper(dispatch));
    }
  };

  const unsubscribeFromChannelMessageUpdated = channelId => {
    if (connected()) {
      clientConnection.off('messageAdded', messageAddedCallbackWrapper(dispatch));

      clientConnection.off('messageDeleted', messageDeletedCallbackWrapper(dispatch));
    }
  };

  const onChannelAddedCallback = newChannel => {
    dispatch({ type: Actions.addChannel, payload: newChannel });
    subscribeToChannelMessageUpdates(newChannel.channelId);
  };

  const onChannelDeletedCallback = channelId => {
    const args = { type: Actions.removeChannel, payload: { channelId } };
    dispatch(args);
    unsubscribeFromChannelMessageUpdated(channelId);
  };

  React.useEffect(() => {
    if (!connected()) return;

    clientConnection.on('channelAdded', onChannelAddedCallback);

    clientConnection.on('channelDeleted', onChannelDeletedCallback);

    clientConnection.invoke('GetChannels').then(channels => {
      dispatch({ type: Actions.addChannels, payload: { channels } });

      channels.forEach(c => {
        clientConnection
          .invoke('GetChannelMessages', Number(c.channelId))
          .then(messages => {
            dispatch({
              type: Actions.updateChannelMessages,
              payload: { messages: messages },
            });
          });

        subscribeToChannelMessageUpdates(c.channelId);
      });
    });

    return () => {
      channels.forEach(c => unsubscribeFromChannelMessageUpdated(c.channelId));
      clientConnection.off('channelAdded', onChannelAddedCallback);

      clientConnection.off('channelDeleted', onChannelDeletedCallback);
      stopSignalRConnection(clientConnection)

    };
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
        <ActiveChannel />
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </>
  );
};

export default MainLayout;
