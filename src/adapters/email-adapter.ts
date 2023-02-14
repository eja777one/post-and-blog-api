import nodemailer from 'nodemailer';

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'blogplatforminfo@gmail.com', // generated ethereal user
        pass: 'yvehgagezjrxvcls', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Blog Platform 👻" <blogplatforminfo@gmail.com>', //sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });

    return info;
  }
};