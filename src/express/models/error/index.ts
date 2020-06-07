import { Document, Schema, Model, model } from "mongoose";

export type ErrorCode =
  | "ERR_AUTH_FAILED"
  | "ERR_INVALID_JWT"
  | "ERR_INVALID_PARMS"
  | "ERR_INCORRECT_PASSWORD_RESET_TOKEN"
  | "ERR_CATEGORY_NOT_FOUND"
  | "ERR_DISTRICT_NOT_FOUND"
  | "ERR_MERCHANT_NOT_FOUND"
  | "ERR_ROOM_NOT_FOUND"
  | "ERR_AHEAD_RESERVED_DATE"
  | "ERR_EXCEED_MAX_BOOKING_SESSION"
  | "ERR_ROOM_IS_RESERVED"
  | "ERR_CONSECUTIVE_BOOKING_NOT_ALLOWED"
  | "ERR_INVALID_START_TIME_OR_END_TIME"
  | "ERR_TIMESLOT_NOT_FOUND"
  | "ERR_INVALID_PAYMENT_METHOD"
  | "ERR_CODE_NOT_PERSISTED_TO_DATABASE"
  | "ERR_UNKNOWN";

export interface IErrorDescription extends Document {
  status: number;
  code: ErrorCode;
  description?: string;
}

const errorDescriptionSchema: Schema = new Schema({
  status: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

const ErrorDescription: Model<IErrorDescription> = model('ErrorDescription', errorDescriptionSchema);
export default ErrorDescription;