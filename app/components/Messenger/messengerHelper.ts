import { Dispatch } from 'react';
import { Actions } from '../../reducers/message/actions';
import { ChannelMessage } from '~/messenger-types';

export const messageAddedCallbackWrapper = () => (msg: ChannelMessage) => {
  dispatch && dispatch({
    type: Actions.updateChannelMessages,
    payload: { messages: [msg] },
  });
};

export const messageDeletedCallbackWrapper = () => (messageId: Number) => {
  dispatch && dispatch({
    type: Actions.removeChannelMessage,
    payload: { messageId },
  });
};
