import { UserDBModel } from '../models';
import { emailAdapter } from './../adapters/email-adapter';

export const emailManager = {
  // async sendEmailRecoveryPassword(user: UserDBModel) {
  //   await emailAdapter.sendEmail(
  //     user.accountData.email,
  //     'password recovery',
  //     '<div>password recovery</div>'
  //   )
  // },
  async sendEmailConfirmation(userEmail: string, code: string) {

    const message = `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code=${code}'>
      complete registration</a>
    </p>`;

    const result = await emailAdapter.sendEmail(userEmail, 'Email confirmation', message);
    return result.envelope;
  },

  async sendRecoveryPasswordCode(userEmail: string, code: string) {

    const message = ` <h1>Password recovery</h1>
    <p>To finish password recovery please follow the link below:
       <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>
       recovery password</a>
   </p>`;

    const result = await emailAdapter.sendEmail(userEmail, 'Password recovery', message);
    return result.envelope;
  },
};