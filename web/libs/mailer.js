var mailer = require('nodemailer');

var smtp = mailer.createTransport('SMTP', {
	host: 'mail.newcapec.net',
	secureConnection: false,
	port: 25,
	auth: {
		user: 'huangxin',
		pass: '8231417hx'
	}
});

module.exports.send = function(options, cb){
	options.from = '找呗科技 huangxin@newcapec.net';
	smtp.sendMail(options, function (err, ok){
		smtp.close();
		if(err) return cb(err);
		cb(null, ok);
	});
};