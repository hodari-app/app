import {open} from '@op-engineering/op-sqlite';
import {drizzle} from 'drizzle-orm/op-sqlite';

const opsqlite = open({name: 'hodari'});
const db = drizzle(opsqlite);

export {db};
