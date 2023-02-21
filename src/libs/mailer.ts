import nodemailer, { SendMailOptions } from 'nodemailer'

class EmailNotifier {
  private getMailer() {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  sendMail(options: SendMailOptions) {
    const mailer = this.getMailer()
    mailer.sendMail(options)
  }
}

export default EmailNotifier
