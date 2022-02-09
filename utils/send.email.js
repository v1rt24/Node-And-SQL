const nodemailer = require('nodemailer');
const formatPrice = require('../utils/formatPrice');

const sendEmail = async (data, result) => {
    let addHTML = '';
    let total = 0;

    for (let i = 0; i < result.length; i++) {
        addHTML += `<div>
                        Название: ${result[i].name};
                        Количество: ${data.cart[result[i].id]} шт.;
                        Цена: ${formatPrice(result[i].cost)};
                    </div>`;

        total += +result[i].cost * data.cart[result[i].id];
    }

    const renderHTML = `
        <h2>Заказ</h2>
        ${addHTML}
        <div>Итого: ${formatPrice(total)}</div>
        <hr>
        <div>Имя: ${data.name}</div>
        <div>Номер телефона: ${data.tel}</div>
        <div>Почта: ${data.email}</div>
        <div>Адрес: ${data.address}</div>
    `;


    // =============== Отправка на почту

    try {
        // SMTP Майла
        /*const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'v1rt24@mail.ru', // пользователь
                pass: 'nAMiY9aDcwHnu0RYf12h', // пароль для внешнего приложения (рабочий)
            },
        });

        const mailOptions = {
            from: 'Почта <v1rt24@mail.ru>',
            to: 'v1rt24@mail.ru, rrublyov@yandex.ru',
            subject: 'Заявка с сайта',
            text: 'Текстовый вариант письма',
            html: renderHTML,
        };*/
        // /SMTP Майла

        // SMTP Яндекса
        const transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'rrublyov', // пользователь
                pass: 'pXW-Fr8-is9-BT3', // пароль
            },
        });

        const mailOptions = {
            from: 'Почта <rrublyov@yandex.ru>',
            to: 'rrublyov@yandex.ru',
            subject: 'Заявка с сайта',
            text: 'Текстовый вариант письма',
            html: renderHTML,
        };
        // /SMTP Яндекса

        const info = await transporter.sendMail(mailOptions);
        // console.log(info);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = sendEmail;