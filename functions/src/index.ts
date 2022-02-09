import * as functions from 'firebase-functions';
import { transportEmail } from './email/transport_email';
import { Status } from './models/status';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
//
export const sendEmail = functions.https.onRequest(async (req, res) => {
  const { email, message, name, phoneNumber } = req.body;

  const errors: string[] = [];
  if (!email) {
    errors.push('Email is required.');
  }

  if (!message) {
    errors.push('Message is required.');
  }

  if (!name) {
    errors.push('Name is required.');
  }

  if (!phoneNumber) {
    errors.push('Phone number is required.');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors, status: Status.BAD_REQUEST });
    return;
  }

  const body: string =
    message + `\n\n- ${name}\np: ${phoneNumber}\ne: ${email}`;
  const subject = `New message from ${name} - ${email}`;

  try {
    const details = await transportEmail(email, subject, body);
    res.status(200).json({ details, status: Status.SUCCESS });
  } catch (error) {
    functions.logger.error(error);
    res.status(500).json({ error, status: Status.ERROR });
  }
});
