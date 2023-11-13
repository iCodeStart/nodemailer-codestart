import fastify from "fastify";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from '@fastify/cors';

dotenv.config();

const app = fastify();

type NodeMail = {
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}

app.register(cors, {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type"]
})


let transport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PASS_SENDER
    }
});

app.post("/send-email", async (request, response) => {
    const { from, to, subject, text, html } = request.body as NodeMail;
    const mailOptions = {
        from,
        to,
        subject,
        html,
        text
    }

    try {
        await transport.sendMail(mailOptions);
        console.log('Enviou o email');
        response.status(200);
    } catch(error){
        console.log(error);
        response.status(500);
    }
});

app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 5000
}).then(() => {
    console.log('Servidor funcionando')
})