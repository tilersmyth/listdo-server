import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as uniqueValidator from 'mongoose-unique-validator';

import { User } from './interfaces/user.interface';

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: [true, `can't be blank`],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      unique: true,
      index: true,
    },
    password: String,
    salt: String,
  },
  { timestamps: true },
);

Schema.plugin(uniqueValidator);

Schema.pre<User>('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512')
    .toString('hex');

  next();
});

Schema.methods = {
  comparePassword(password: string): boolean {
    return (
      this.password ===
      crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
        .toString('hex')
    );
  },
};

export const UserSchema = Schema;