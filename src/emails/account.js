const sgMail = require("@sendgrid/mail");
const sendGridAPIKey = process.env.SECRET_OR_PRIVATE_KEY;

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name) => {
   sgMail.send({
      to: email,
      from: "aionius@gmail.com",
      subject: "Thanks for joining in",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app`
   });
};

const sendCancellationEmail = (email, name) => {
   sgMail.send({
      to: email,
      from: "aionius@gmail.com",
      subject: "Account Cancellation",
      text: `Sorry to see you go ${name}.`
   });
};

module.exports = {
   sendWelcomeEmail,
   sendCancellationEmail
};
