export interface IUser {
  billingCardBrand?: string;
  billingCardExpMonth?: string;
  billingCardExpYear?: string;
  billingCardLast4?: string;
  email?: string;
  emailChangeCandidate?: string;
  emailProofToken?: string;
  emailProofTokenExpiresAt?: number;
  emailStatus?: string;
  facebookId?: string;
  fullName?: string;
  googleId?: string;
  hasBillingCard?: boolean;
  password?: string;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: number;
  role?: string;
  stripeCustomerId?: string;
  telephone?: number;
  tosAcceptedByIp?: string;
  username: string;
}
