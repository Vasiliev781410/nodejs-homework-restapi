const nodemailer = require('nodemailer');
require('dotenv').config();
const {MAIL_PASSWORD, OAUTH_CLIENTID, OAUTH_CLIENT_SECRET, OAUTH_REFRESH_TOKEN} = process.env;

const sendEmail = async(data) => {
  const nodemailerconfig = {
    service: "gmail",
    auth: {
      type: 'OAuth2',
      user: "sas.businessprocess@gmail.com", 
      pass: MAIL_PASSWORD,
      clientId: OAUTH_CLIENTID,
      clientSecret: OAUTH_CLIENT_SECRET,
      refreshToken: OAUTH_REFRESH_TOKEN 
    },
  };

  const transporter = nodemailer.createTransport(nodemailerconfig);

  const email = {...data, from: "sas.businessprocess@gmail.com"};

  const info = await transporter.sendMail(email);
  console.log("Message sent: ", info.messageId);

  return true;
};

module.exports = sendEmail;
