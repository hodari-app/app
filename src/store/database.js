import {open} from '@op-engineering/op-sqlite';
import {drizzle} from 'drizzle-orm/op-sqlite';
import * as Sentry from '@sentry/react-native';

import * as schema from './schema';

const opsqlite = open({name: 'hodari'});
const db = drizzle(opsqlite);

export async function getChants() {
  try {
    return await db.select().from(schema.chants);
  } catch (error) {
    Sentry.captureException(error);
    return [];
  }
}

export async function setChants(chants) {
  try {
    await db.delete(schema.chants);
    await db.insert(schema.chants).values(chants);
  } catch (e) {
    Sentry.captureException(e);
  }
}

export {db};
