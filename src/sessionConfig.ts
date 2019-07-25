import * as Store from 'connect-redis';
import * as session from 'express-session';

import { redis } from './redis';

export const sessionConfig = () => {
  const RedisStore = Store(session);
  const store = new RedisStore({
    client: redis as any,
  });

  return session({
    store,
    name: 'qid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  });
};
