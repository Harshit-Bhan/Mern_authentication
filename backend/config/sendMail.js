import {createTransport} from 'nodemailer';

const sendMail = async ({email , subject , html}) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: "djdjjsfnd",
            pass: "djabndewbew",
        },
    });

    await transport.sendMail({
        from: "djdjjsfnd",
        to: email,
        subject,
        html,
    });
};

export default sendMail;