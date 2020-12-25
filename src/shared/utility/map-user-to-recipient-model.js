import { EmailRecipientModel } from '2020-messaging';

export const mapUserToRecipientModel = user => new EmailRecipientModel({
  address: user.email,
  templatePairs: {
    '###name###': user.displayName,
    '###email###': user.email,
  },
});
