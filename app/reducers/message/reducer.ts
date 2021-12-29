import { cloneDeep } from 'lodash';
import { Actions } from './actions';
import moment from 'moment';
import { Channel, MessengerState, ChannelMessage } from '~/messenger-types';
import { HubConnection } from '@microsoft/signalr';

export type ActionType = {
  payload: {
    clientConnection: HubConnection;
    activeChannel: string;
    name: string;
    channelId: Number;
    user: string;
    channels: Channel[];
    messages: ChannelMessage[];
  };
  type: Actions;
};

export const messageReducer = (
  state: MessengerState,
  action: ActionType
) => {
  const { name, channelId } = action.payload;

  console.log('At head of reducer****');
  console.log({ state, action });

  switch (action.type) {
    case Actions.setUser:
      const { user } = action.payload;
      const newState = {
          ...state,
          user,
          stats: updateStats(state),
      };
      console.log('Reducer: setUser');
      console.log({ newState });

      return newState;
    case Actions.addChannel:
      if (
        state.user === '' ||
        name === '' ||
        channelIdExists(state.channels, channelId)
      )
        return state;
      return {
          ...state,
          channels: [...state.channels, { name, channelId, messages: [] }],
          stats: updateStats(state),
      };
    case Actions.addChannels:
      const { channels } = action.payload;

      if (channels == null || channels.length === 0) {
        return state;
      }
      return {
          ...state,
          channels: addChannels(state, channels),
          stats: updateStats(state),
      };

    case Actions.removeChannel:
      if (state.user === '') return state;
      const nameOfChannel = getChannelName(channelId, state.channels);
      return {
          ...state,
          activeChannel:
            nameOfChannel === state.activeChannel ? '' : state.activeChannel,
          channels: state.channels.filter(
            c => c.channelId.toString() !== channelId.toString()
          ),
          stats: updateStats(state),
      };
    case Actions.removeChannelByName:
      const { activeChannel } = state;
      if (
        state.user === '' ||
        name === '' ||
        !channelNameExists(state.channels, name)
      )
        return state;
      const removedChanState = {
        ...state,
        activeChannel: activeChannel === name ? '' : activeChannel,
        channels: state.channels.filter(c => c.name !== name),
      };
      return {
          ...removedChanState,
          stats: updateStats({ ...removedChanState }),
      };

    case Actions.updateChannelMessages:
      const { messages } = action.payload;
      const changedState = {
        ...state,
        channels: addMessagesToChannel(state, messages),
      };
      return {
          ...changedState,
          stats: updateStats(state),
      };
    case Actions.setClientConnection:
      return {
          ...state,
          clientConnection: action.payload.clientConnection,
          stats: updateStats(state),
      };
    case Actions.setActiveChannel:
      const channelName = action.payload.activeChannel;
      return {
          ...state,
          activeChannel: channelName,
          activeChannelId:
            channelName === '' ? Number(0): getChannelId(channelName, state.channels),
          stats: updateStats(state),
      };
    case Actions.removeChannelMessage:
      return {
          ...state,
          channels: removeChannelMessage(state, action),
          stats: updateStats(state),
      };
    default:
      return state;
  }
};

const getChannelId = (name: string | undefined, channels: Channel[]) => {
  const channel = channels?.find(c => c.name === name);
  return channel == null ? Number(0) : channel.channelId;
};

const getChannelName = (channelId: Number, channels: Channel[]) => {
  const channel = channels?.find(
    c => c.channelId.toString() === channelId.toString()
  );

  return channel == null ? '' : channel.name;
};

const channelIdExists = (channels: Channel[], channelId: Number) => {
  if (channelId === undefined) {
    return true;
  }

  channels?.some(c => c.channelId.toString() === channelId.toString());
};

const channelNameExists = (channels: Channel[], name: string | undefined) =>
  channels?.some(c => c.name === name);

const addMessagesToChannel = (
  state: MessengerState,
  messages: ChannelMessage[] | undefined
) => {
  const updatedChannels =
    state.channels === [] ? [] : cloneDeep(state.channels);

  messages?.forEach(m => {
    const channel = updatedChannels.find(c => c.channelId === m.channelId);

    if (channel) {
      if (
        !channel.messages.some(
          cm => cm.messageId.toString() === m.messageId.toString()
        )
      ) {
        channel.messages.push(m);
      }
    }
  });
  return [...updatedChannels];
};

const addChannels = (state: MessengerState, channels: Channel[]) => {
  const updatedChannels =
    state.channels === [] ? [] : cloneDeep(state.channels);

  channels?.forEach(c => {
    if (!channelIdExists(updatedChannels, c.channelId))
      updatedChannels.push({ ...c, messages: [] });
  });
  return updatedChannels;
};

const removeChannelMessage = (
  state: MessengerState,
  action: { payload: any; type?: string }
) => {
  const { messageId } = action.payload;
  const updatedChannels = cloneDeep(state.channels);

  let channelToUpdate = updatedChannels.find(c =>
    c.messages.some(m => m.messageId.toString() === messageId.toString())
  );

  if (channelToUpdate == null) return updatedChannels;

  const channelId = channelToUpdate.channelId;

  updatedChannels.forEach(c => {
    if (c.channelId.toString() === channelId.toString()) {
      c.messages = c.messages.filter(
        m => m.messageId.toString() !== messageId.toString()
      );
    }
  });

  return updatedChannels;
};

const updateStats = (state: MessengerState) => {
  return {
    ...state.stats,
    activeChannels: state.channels.length,
    lastMessageStat: getMostRecentMessageStat(state.channels),
  };
};

const getMostRecentMessageStat = (channels: Channel[]) => {
  let mostRecentMessage: ChannelMessage | null = null;
  let mostRecentChannel: Channel | null = null;
  let currTime = moment(new Date('1970-01-01Z00:00:00:000'));
  channels.reduce((prev: Channel, curr: Channel) => {
    curr?.messages.forEach(m => {
      const msgTimestamp = moment(m?.createdOn);
      if (msgTimestamp?.isAfter(currTime)) {
        mostRecentMessage = m;
        mostRecentChannel = curr;
        currTime = msgTimestamp;
      }
    });
    return prev;
  });

  if (mostRecentMessage == null || mostRecentChannel == null) return '';

  const { author, createdOn } = mostRecentMessage;
  const { name } = mostRecentChannel;
  return `Most recent message sent from ${author} on ${name} at ${moment(
    createdOn
  ).format('MMM DD YYYY hh:mm:ss a')}`;
};
