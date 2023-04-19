const nodemailer = require('nodemailer');
require('dotenv').config();



const setTransporter = async() => {
  const testAccount = await nodemailer.createTestAccount();

  console.log("user: ", testAccount.user);

  const nodemailerconfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  };
  
  const transporter = nodemailer.createTransport(nodemailerconfig);
  const mailer = {transporter, testAccount};

  return mailer; 
};

const sendEmail = async(data) => {
  const {transporter, testAccount} = await setTransporter();

  const email = {...data, from: testAccount.user};

  const info = await transporter.sendMail(email);
  console.log("Message sent: %s", info.messageId);

  return true;
};

module.exports = sendEmail;
