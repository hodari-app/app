import {sqliteTable, text} from 'drizzle-orm/sqlite-core';

export const chants = sqliteTable('chants', {
  id: text('id').primaryKey(),
  title: text('title'),
  body: text('body'),
  categories: text('categories', {mode: 'json'}),
  videoUrl: text('videoUrl'),
  updatedAt: text('updatedAt'),
});
