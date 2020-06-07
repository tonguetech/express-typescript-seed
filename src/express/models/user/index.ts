import { Schema, Model, model, Document } from "mongoose";

export interface IUser extends Document {
  billingCardBrand: string,
  billingCardExpMonth: string,
  billingCardExpYear: string,
  billingCardLast4: string,
  email: string,
  emailChangeCandidate: string,
  emailProofToken: string,
  emailProofTokenExpiresAt: number,
  emailStatus: string,
  facebookId: string,
  fullName: string,
  googleId: string,
  hasBillingCard: boolean,
  password: string,
  passwordResetToken: string,
  passwordResetTokenExpiresAt: string,
  role: string,
  stripeCustomerId: string,
  telephone: number,
  tosAcceptedByIp: string,
  username: string,
}

const userSchema: Schema = new Schema({
  billingCardBrand: { type: String },
  billingCardExpMonth: { type: String },
  billingCardExpYear: { type: String },
  billingCardLast4: { type: String },
  email: { type: String, required: true, unique: true },
  emailChangeCandidate: { type: String },
  emailProofToken: { type: String },
  emailProofTokenExpiresAt: { type: Number },
  emailStatus: { type: String },
  facebookId: { type: String, unique: true },
  fullName: { type: String },
  googleId: { type: String, unique: true },
  hasBillingCard: { type: Boolean },
  password: { type: String },
  passwordResetToken: { type: String },
  passwordResetTokenExpiresAt: { type: Number },
  role: { type: String },
  stripeCustomerId: { type: String, unique: true },
  telephone: { type: Number },
  tosAcceptedByIp: { type: String },
  username: { type: String, required: true, unique: true }
});

const User: Model<IUser> = model('User', userSchema);
export default User;
