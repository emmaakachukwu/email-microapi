const nodeMailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");


const auth = {
    auth: {
        api_key: "81b236cb0823e1955546c3d463d8fc67-1b6eb03d-307e03a8",
        domain: "https://app.mailgun.com/app/sending/domains/sandboxcc6a2db9651b4a71963e011332408aec.mailgun.org"
    }
};

const transporter = nodeMailer.createTransport(mailGun(auth));

const sendMail = function(email, subject, text, cb){
    const mailOptions = {
        from: email,
        to:'hammedt20@gmail.com' ,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, function(err, data){
        if(err){
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}

module.exports = sendMail;

