import { Document } from 'mongoose';

import { Email } from './email.interface';

export interface EmailSchema extends Document, Email {}
