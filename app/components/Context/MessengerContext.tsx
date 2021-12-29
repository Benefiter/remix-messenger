import React from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import { initMessengerContextProviderState, initMessengerState } from './../../state';
import { messageReducer } from './../../reducers/message/reducer';
import { Channel, MessengerContextProvider } from '~/messenger-types';

const MessengerContext = React.createContext<MessengerContextProvider>(initMessengerContextProviderState);

export type ChildrenProps = {
  children? : React.ReactNode
}
export const MessengerProvider = ({ children }: ChildrenProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = React.useState(false);
  const [state, dispatch] = React.useReducer(messageReducer, {
    ...initMessengerState,
  });

  const { clientConnection, channels } = state;

  const connected = () =>
    clientConnection?.state === HubConnectionState.Connected;

  const getChannelIdFromName = (name: string) => {
    const channel = channels?.find((c: Channel) => c.name === name);

    return channel ? Number(channel.channelId) : 0;
  };

  const toggleSidebar = () => {
    setSidebarIsOpen(state => !state);
  };

  return (
    <MessengerContext.Provider
      value={{ state, dispatch, connected, getChannelIdFromName, sidebarIsOpen, toggleSidebar }}
    >
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessengerProvider = () => {
  const context = React.useContext(MessengerContext);

//   if (context === undefined) {
//     throw new Error(
//       'useMessengerProvider must be used within a MessengerContext Provider'
//     );
//   }

  return context;
};
