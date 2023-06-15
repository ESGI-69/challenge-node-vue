import SibApiV3Sdk from 'sib-api-v3-sdk';

const mailer = {
  /**
   * Send email with sendinblue APi
   * @param {string} to - email address of the recipient
   * @param {string} subject - subject of the email
   * @param {string} html - html content of the email
   */
  sendMail: async (to, subject, html) => {
    const apiKey = process.env.SENDINBLUE_KEY;
    const sender = { email: process.env.SENDINBLUE_EMAIL, name: process.env.SENDINBLUE_NAME };
    const recipient = { email: to };
    const message = { htmlContent: html, subject, sender, to: [recipient] };
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications['api-key'].apiKey = apiKey;
    try {
      await apiInstance.sendTransacEmail(message);
    } catch (error) {
      console.error(`Failed to send email to ${to}: ${error}`);
    }
  }
};

export default mailer;
