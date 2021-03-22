const nodemailer = require('nodemailer');

class Transporter {
    constructor() {
        this.init = this.init.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.email = 'xride720@gmail.com';
    }
    async sendMail(body) {
        let result;
        body.from = ``;
        try {
            result = await this.transporter.sendMail(body);
        } catch (e) {
            console.log(e);
        }
        console.log(result);
        console.log('send try');
    }

    async init() { // устанавливается ящик, с которого будут отправляться письма
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'xride720@gmail.com',
                pass: 'Www.x-ride720',
            },
        });
    }
}

module.exports = Transporter;