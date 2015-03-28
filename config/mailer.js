var mailer = require('express-mailer');

module.exports = function(app) {

    mailer.extend(app, {
        from: process.env.EMAIL_REPLY_TO,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secureConnection: true,
        transportMethod: 'SMTP',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

}