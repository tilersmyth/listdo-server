import * as Store from 'connect-redis';
import * as session from 'express-session';

export const express = (store: Store.RedisStore) =>
  session({
    store,
    name: 'listDo',
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
