import { db } from './db.server';

type channelAddDBOperationArgs = {
  name: string;
};

type chanelIdDBOperation = {
  channelId: string;
};

export async function addChannel({ name }: channelAddDBOperationArgs) {
  return db.channel.create({
    data: { name },
  });
}

export async function removeChannel({
  channelId,
}: chanelIdDBOperation) {
  await db.message.deleteMany({
    where: {channelId}
  })
  return db.channel.delete({
    where: { channelId },
  });
}

type messagelAddDBOperationArgs = {
  author: string;
  content: string;
  channelId: string
};

type messageRemoveDBOperationArgs = {
  messageId: string;
};

export async function addMessage({ author, content, channelId }: messagelAddDBOperationArgs) {
  return db.message.create({
    data: { author, content, channelId},
  });
}

export async function removeMessage({
  messageId,
}: messageRemoveDBOperationArgs) {
  return db.message.delete({
    where: { messageId },
  });
}

export async function getAllMessagesOnChannel({
  channelId,
}: chanelIdDBOperation) {
  return db.message.findMany({
    where: {channelId}
  })
}

export async function getAllChannels() {
  return {channels: await db.channel.findMany()}
}

type PrismaChannelDef = {
  channelId: string,
  name: string
}

export async function getMessagesForChannels(channels: PrismaChannelDef[]) {
  return Promise.all(channels.map(async c => {
    return await getAllMessagesOnChannel({channelId: c.channelId.toString()})
  })).then(results => {
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
}
