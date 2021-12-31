import axios from 'axios';
import { Channel } from '~/messenger-types';

export const getChannels = async () => {
  try {
    const res = await axios.get('https://localhost:5001/channels');
    const channels = res.data;

    return {
      channels,
    };
  } catch (error) {
    console.log('In catch of catch-try');
    console.log({ error });
    return {
      error,
    };
  }
};

export const getMessagesForChannels = async (channels: Channel[]) => {
  return Promise.all(
    channels.map(async c => {
      let resp;
      resp = await axios.get(
        `https://localhost:5001/channels/${c.channelId}/messages`
      );
      return resp?.data;
    })
  )
    .then(results => {
      return {
        messages: results.reduce((prev, cur) => {
          return [...prev, ...cur];
        }, []),
        error: null
      };
    })
    .catch(error => {
      return { messages: [], error };
    });
};
