interface Auth {
  expiresIn: number;
  token: string;
  userId: string;
}

export interface Login {
  status: number;
  auth: Auth | null;
}
