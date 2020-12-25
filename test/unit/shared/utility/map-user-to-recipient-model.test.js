import { EmailRecipientModel } from '2020-messaging';
import { mapUserToRecipientModel }
  from 'shared/utility/map-user-to-recipient-model';

describe('mapUserToRecipientModel()', () => {
  it('appends plus sign parts of emails for ###email###', () => {
    const email = 'asdf+asdf@asdf.asdf';
    const firstName = 'Jerry';
    const lastName = 'Seinfeld';
    const displayName = 'j-sein';

    const input = { email, firstName, lastName, displayName };
    const output = mapUserToRecipientModel(input);

    expect(output).toBeInstanceOf(EmailRecipientModel);
    expect(output.templatePairs['###email###']).toBe(email);
  });

  it('uses displayName instead of firstName and lastName for ###name###', () => {
    const email = 'asdf+asdf@asdf.asdf';
    const firstName = 'Jerry';
    const lastName = 'Seinfeld';
    const displayName = 'j-sein';

    const input = { email, firstName, lastName, displayName };
    const output = mapUserToRecipientModel(input);

    expect(output).toBeInstanceOf(EmailRecipientModel);
    expect(output.templatePairs['###name###']).toBe(displayName);
  });
});
