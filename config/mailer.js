var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var hbs = require('nodemailer-express-handlebars');

module.exports = function(app) {

    var transporter = nodemailer.createTransport(smtpTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }));

    //Template options
    var options = {
        viewEngine: {
            layoutsDir: 'views/layouts/email/',
            defaultLayout : 'default',
            partialsDir : 'views/partials/email'
        },
        viewPath: 'views/emails/'
    };

    transporter.use('compile', hbs(options));

    app.sendMail = function(options) {
        var mailOptions = {
            from: process.env.EMAIL_REPLY_TO,
            to: options.to,
            subject: options.subject,
            template: options.template,
            context: options
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
            } else {
                console.log('Email message sent: ' + info.response);
            }
        });
    }

}