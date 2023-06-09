import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendMail = async (to, subject, html) => {
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
};

export default sendMail;
