import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendMail = async (to, subject, html) => {
  const apiKey = process.env.SENDINBLUE_KEY;
  console.log('apikey', apiKey);
  const sender = { email: 'test@test.com', name: 'bloblibou' };
  const recipient = { email: to };
  const message = { htmlContent: html, subject, sender, to: [recipient] };
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = apiKey;
  try {
    const response = await apiInstance.sendTransacEmail(message);
    console.log(`Email sent to ${to}: ${response.messageId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}: ${error}`);
  }
};

export default sendMail;
