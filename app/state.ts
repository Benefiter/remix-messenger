import { MessengerState } from './messenger-types';

export const initMessengerState: MessengerState = {
    channels: [],
    user: '',
    clientConnection: null,
    activeChannel: '',
    activeChannelId: 0,
    subscribedForMessageUpdates: false,
    stats: {
      activeChannels: 0,
      lastMessageStat: '',
    },
};

export const initMessengerContextProviderState = {
  state: {
      ...initMessengerState
  },
  dispatch: undefined,
  connected: undefined,
  getChannelIdFromName: undefined,
  sidebarIsOpen: false,
  toggleSidebar: undefined,
};
