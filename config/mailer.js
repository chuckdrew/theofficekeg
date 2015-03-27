var mailer = require('express-mailer');

module.exports = function(app) {

    mailer.extend(app, {
        from: 'noreply@theofficekeg.com',
        host: 'smtp.mailgun.org',
        secureConnection: true,
        port: 465,
        transportMethod: 'SMTP',
        auth: {
            user: 'postmaster@theofficekeg.com',
            pass: '5e8e798498fc12a84ff6bccb02fae8c2'
        }
    });

}