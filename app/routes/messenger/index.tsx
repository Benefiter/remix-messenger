import { LoaderFunction, useLoaderData } from 'remix';
import { getSession } from '~/sessions';
import { Container, Row } from 'reactstrap';
import ActiveChannel from '../../components/ActiveChannel/ActiveChannel';
import axios from 'axios';
import { env } from 'process';
import { Channel } from '~/messenger-types';
import Layout from '~/components/Layout';
import { useMessengerProvider } from '~/components/Context/MessengerContext';
import {
  messageAddedCallbackWrapper,
  messageDeletedCallbackWrapper,
} from './../../services/signalR/signalrClient';
import { Actions } from '~/reducers/message/actions';
import React from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  session.get('userId');

  env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const res = await axios.get('https://localhost:5001/channels');
  const existingChannels = res.data;

  const existingMessages = await getChannelMessages(existingChannels);

  return {
    loginUser: session.has('userId') ? await session.get('userId') : null,
    existingChannels,
    existingMessages,
  };
};

const getChannelMessages = async (channels: Channel[]) => {
  return Promise.all(
    channels.map(async c => {
      let resp;
      resp = await axios.get(
        `https://localhost:5001/channels/${c.channelId}/messages`
      );
      return resp?.data;
    })
  ).then(results =>
    results.reduce((prev, cur) => {
      return [...prev, ...cur];
    }, [])
  );
};

const Index = () => {
  const { existingChannels, existingMessages, loginUser } = useLoaderData();
  
  const { state, dispatch, connected } = useMessengerProvider();

  const { clientConnection, user, channels } = state;

  React.useEffect(() => {

    console.log('****USEEFFECT');
    console.log({user});
  },[user])
  const subscribeToChannelMessageUpdates = (channelId: Number) => {
    if (connected && connected()) {
      clientConnection.invoke('SubscribeToMessageChannel', channelId);

      dispatch &&
        clientConnection.on(
          'messageAdded',
          messageAddedCallbackWrapper(dispatch)
        );

      dispatch &&
        clientConnection.on(
          'messageDeleted',
          messageDeletedCallbackWrapper(dispatch)
        );
    }
  };

  const unsubscribeFromChannelMessageUpdated = (channelId: Number) => {
    if (connected && connected()) {
      dispatch &&
        clientConnection.off(
          'messageAdded',
          messageAddedCallbackWrapper(dispatch)
        );

      dispatch &&
        clientConnection.off(
          'messageDeleted',
          messageDeletedCallbackWrapper(dispatch)
        );
    }
  };

  const onChannelAddedCallback = (newChannel: Channel) => {
    dispatch && dispatch({ type: Actions.addChannel, payload: newChannel });
    subscribeToChannelMessageUpdates(newChannel.channelId);
  };

  const onChannelDeletedCallback = (channelId: Number) => {
    const args = { type: Actions.removeChannel, payload: { channelId } };
    dispatch && dispatch(args);
    unsubscribeFromChannelMessageUpdated(channelId);
  };

  React.useEffect(() => {
    dispatch && dispatch( {
      type: Actions.setUser,
      paylod: {user}
    })
    dispatch &&
      dispatch({
        type: Actions.addChannels,
        payload: { channels: existingChannels },
      });
    dispatch &&
      dispatch({
        type: Actions.updateChannelMessages,
        payload: { messages: existingMessages },
      });

    if (connected && connected()) {
      clientConnection.on('channelAdded', onChannelAddedCallback);

      clientConnection.on('channelDeleted', onChannelDeletedCallback);

      existingChannels.forEach((c: Channel) => {
        subscribeToChannelMessageUpdates(c.channelId);
      });
    }

    return () => {
      channels.forEach(c => unsubscribeFromChannelMessageUpdated(c.channelId));
      connected && clientConnection.off('channelAdded', onChannelAddedCallback);

      connected && clientConnection.off('channelDeleted', onChannelDeletedCallback);

      dispatch &&
        dispatch({
          type: Actions.setClientConnection,
          payload: { clientConnection: null },
        });
    };
  }, [existingMessages, existingChannels]);

  return (
    <>
      <Layout existingChannels={existingChannels} existingMessages={existingMessages} loginUser={loginUser}>
        <Container fluid>
          <Row>
            <ActiveChannel />
          </Row>
          <Row>{/* <Footer /> */}</Row>
        </Container>
      </Layout>
    </>
  );
};

export default Index;
