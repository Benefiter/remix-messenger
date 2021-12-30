import {
  HubConnectionBuilder,
  LogLevel,
  HubConnectionState,
  HubConnection,
} from '@microsoft/signalr';
import { Actions } from '../../reducers/message/actions';
import { ChannelMessage } from '~/messenger-types';

const BASE_BACKEND_URL = 'https://localhost:5001/hubs/messages';

function canConsoleLog() {
  return true;
}

const onSignalREvent = (error: any, eventName: any) => {
  const consoleLog = canConsoleLog();

  if (consoleLog) {
    console.log(eventName, error);
    return;
  }
  if (error) {
    console.log(`${eventName} Error: \r${error}`);
  }
};

const onReconnected = (connectionId: any, signalrClient: HubConnection) => {
  if (!connectionId) {
    console.log('SignalR Reconnected failed to get a connection id');
    return;
  }

  subscribeToPortalChanges(signalrClient);

  const consoleLog = canConsoleLog();

  if (consoleLog) {
    console.log(`SignalR Reconnected: ${connectionId}`);
    return;
  }
};

const subscribeToPortalChanges = (signalrClient: HubConnection) => {

  if (signalrClient.state === HubConnectionState.Connected) {
    signalrClient.invoke('SubscribeToChannelsChannel');
  }
};

export const startSignalRConnection = async () => {
  console.log("####### startSignalRConnection called")
  const signalrClient = new HubConnectionBuilder()
    .withUrl(BASE_BACKEND_URL)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Critical)
    .build();
  const consoleLog = canConsoleLog();
  let conn = signalrClient;

  await conn
    .start()
    .then(() => {
      conn.invoke('SubscribeToChannelsChannel');

      conn.onclose(error => onSignalREvent(error, 'SignalR Closed | '));
      conn.onreconnecting(error =>
        onSignalREvent(error, 'SignalR Reconnecting | ')
      );
      conn.onreconnected(connectionId => onReconnected(connectionId, signalrClient));
    })
    .catch(error => {
      if (consoleLog) {
        console.log(`SignalR failed to connect: \r${error}`);
      }
      console.log(`SignalR failed to connect: \r${error}`);
      return null;
    });
  return signalrClient;
}

export const stopSignalRConnection = (clientConnection: HubConnection) => {
    clientConnection?.stop();
}

  export const messageAddedCallbackWrapper = (dispatch: React.Dispatch<any>) => (msg: ChannelMessage) => {
    dispatch({
      type: Actions.updateChannelMessages,
      payload: { messages: [msg] },
    });
  };
  
  export const messageDeletedCallbackWrapper = (dispatch: React.Dispatch<any>) => (messageId: Number) => {
    dispatch({
      type: Actions.removeChannelMessage,
      payload: { messageId },
    });
  };
  
