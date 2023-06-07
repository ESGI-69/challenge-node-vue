import SibApiV3Sdk from 'sib-api-v3-sdk';

const sendMail = async (to, subject, html) => {
//   const apiKey = process.env.SENDINBLUE_KEY;
//   const sender = { email: process.env.SENDINBLUE_EMAIL, name: process.env.SENDINBLUE_NAME };
//   const recipient = { email: to };
//   const message = { htmlContent: html, subject, sender, to: [recipient] };
//   const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
//   apiInstance.setApiKey(apiKey);
//   try {
//     const response = await apiInstance.sendTransacEmail(message);
//     console.log(`Email sent to ${to} with subject ${subject}. Response: ${response}`);
//   } catch (err) {
//     console.error(err);
//   }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SENDINBLUE_KEY;
  const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
  const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
  emailCampaigns.name = 'Campaign sent via the API';
  emailCampaigns.subject = subject;
  emailCampaigns.sender = { name: process.env.SENDINBLUE_NAME, email: process.env.SENDINBLUE_EMAIL };
  emailCampaigns.type = 'classic';
  emailCampaigns.htmlContent = html;
  emailCampaigns.recipients = { listIds: [listId], to: [{ email: to }] };
  emailCampaigns.scheduledAt = '2018-01-01 00:00:01';
  apiInstance.createEmailCampaign(emailCampaigns).then(
    function (data) {
      console.log('API called successfully. Returned data: ' + data);
    },
    function (error) {
      console.error(error);
    }
  );
};

export default sendMail;
