const knex = require('../database');
var nodemailer = require('nodemailer');

module.exports = {
    index(req, res, next){
        return res.render('home/index',{
            layout: '',
        });
    },
    home(req, res, next){
        return res.render('home/home',{
            layout: 'default',
        });
    },
    sendMail(req, res, next){
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if( !req.body.name || typeof req.body.name == undefined || req.body.name == null){
            return res.send('Nome Inválido');
        }
        if( !req.body.email || typeof req.body.email == undefined || req.body.email == null || !emailRegexp.test(req.body.email)){
            return res.send('Email Inválido');
        }
        if( !req.body.phone || typeof req.body.phone == undefined || req.body.phone == null){
            return res.send('Número Inválido');
        }
        if( !req.body.message || typeof req.body.message == undefined || req.body.message == null){
            return res.send('Messagem Inválido');
        }
        var {name,email, phone, message} = req.body;
        var content = `<body style="margin: 0;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";font-size: 1rem;font-weight: 400;line-height: 1.5;color: #212529;text-align: left;background-color: #fff;">
            <table style="border-collapse: collapse;background-color: #fff;width: 100%;max-width: 100%;margin-bottom: 1rem;background-color: transparent;">
            <thead>
            <tr>
                <th scope="col" style="color: #fff;background-color: #212529;border-color: #32383e;text-align: inherit;vertical-align: bottom;border-bottom: 2px solid #dee2e6;padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">Título</th>
                <th scope="col" style="color: #fff;background-color: #212529;border-color: #32383e;text-align: inherit;vertical-align: bottom;\border-bottom: 2px solid #dee2e6;padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">Dados</th>
            </tr>
            </thead>
            <tbody style="border-top: 2px solid #dee2e6">
            <tr style="background-color:#f0f0f0">
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">Nome</td>
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">${name}</td>
            </tr>
            <tr style="background-color:#f0f0f0">
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">E-mail</td>
                <td style="padding: 0.75rem;
                vertical-align: top;
                border-top: 1px solid #dee2e6;">${email}</td>
            </tr>
            <tr style="background-color:#f0f0f0">
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">Celular/Telefone</td>
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">${phone}</td>
            </tr>
            <tr style="background-color:#f0f0f0">
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">Mensagem</td>
                <td style="padding: 0.75rem;vertical-align: top;border-top: 1px solid #dee2e6;">${message}</td>
            </tr>
            </tbody>
            </table>
            </body>`;
        var rementent = nodemailer.createTransport({
            host: 'email-1.smartbr.com',
            service: 'smtp',
            port: '587',
            secure: false,
            auth: {
                user: 'contato@smartbr.com',
                pass: 'Smart@2020'
            }
        });
        var send = {
            from: 'contato@smartbr.com',
            to: 'contato@smartbr.com',
            subject: 'Contato',
            html: content
        }

        rementent.sendMail(send, (error)=>{
            if(error){
                return res.send(error);
            }
            else{
                return res.send('1');
            }
        });
    }
}