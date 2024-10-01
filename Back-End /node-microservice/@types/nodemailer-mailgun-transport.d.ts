
declare module 'nodemailer-mailgun-transport' {
  import { TransportOptions } from 'nodemailer';

  interface MailgunOptions {
    auth: {
      api_key: string;
      domain: string;
    };
  }

  function mailgunTransport(options: MailgunOptions): TransportOptions;

  export default mailgunTransport;
}
