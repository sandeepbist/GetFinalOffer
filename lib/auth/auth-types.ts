import type { auth } from "../auth";

export type Session = typeof auth.$Infer.Session;

export type TUserAuth = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};
