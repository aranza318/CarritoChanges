import twilio from "twilio";
import { TWILIO_SID } from "../config/configs";

export const client = twilio(TWILIO_SID);

