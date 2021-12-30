import { Dispatch } from 'react';
import { Actions } from '../../reducers/message/actions';
import { ChannelMessage } from '~/messenger-types';

export const messageAddedCallbackWrapper = () => (msg: ChannelMessage) => {
};

export const messageDeletedCallbackWrapper = () => (messageId: Number) => {
};
