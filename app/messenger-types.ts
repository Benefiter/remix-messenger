import React from 'react';

export interface Channel {
  channelId: Number;
  name: string;
  messages: ChannelMessage[];
}

export type ChannelMessage = {
  messageId: Number;
  channelId: Number;
  author: string;
  createdOn: string;
  content: string;
};

export type Stats = {
  activeChannels: Number;
  lastMessageStat: string;
};

export interface MessengerState {
  channels: Channel[];
  user: string;
  clientConnection: any;
  activeChannel: string;
  activeChannelId: Number;
  subscribedForMessageUpdates: boolean;
  stats: Stats;
}

export interface MessengerContextProvider {
  state: MessengerState,
  dispatch: React.Dispatch<any> | undefined;
  connected: (() => boolean) | undefined;
  getChannelIdFromName: ((id: string) => Number) | undefined;
  sidebarIsOpen: boolean;
  toggleSidebar: (() => void) | undefined;
}
