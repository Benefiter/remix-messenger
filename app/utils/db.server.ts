import { PrismaClient } from '@prisma/client';
import EventEmitter from 'events';
import {
  PrismaEventDispatcherOptions,
} from 'prisma-event-dispatcher';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

export const dbItemChangedEventEmitter = new EventEmitter();


// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: [{ level: 'query', emit: 'event' }],
    });
    global.__db.$use(async (params, next) => {
        // Manipulate params here
        // if (['create', 'delete'].includes(params.action)) {
        //   console.log('about to  emit event')
        //   console.log(params)
        //   dbItemChangedEventEmitter.emit('dbItemCreateOrDeleteEvent')
        // }
        const result = await next(params)
        // See results here
        return result
      });

    global.__db.$connect();
  }
  db = global.__db;
}

export { db };
