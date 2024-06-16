import 'drizzle-kit';

export default {
  schema: './src/store/schema.js',
  out: './src/store/migrations',
  dialect: 'sqlite',
  driver: 'expo',
};
