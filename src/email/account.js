const nodemailer = require('nodemailer')

function transporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'chitizsambhav23@gmail.com',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        }})
}
 
function sendWelcomeEmail(email, name) {
    const transporterObject = transporter()
    transporterObject.sendMail({
        from: 'chitizsambhav23@gmail.com',
        to: email,
        subject: 'Thanks for joining!',
        text: `Welcome to our service, ${name}!`,
        html: `<b>Welcome to our service, ${name}!</b>`
    })
}
 
function sendDeleteEmail(email, name) {
    const transporterObject = transporter()
    transporterObject.sendMail({
        from: 'task.manager.app.2024@gmail.com',
        to: email,
        subject: 'We\'re sorry to see you leave',
        text: `We hope to see you back again someday, ${name}!`,
        html: `<b>We hope to see you back again someday, ${name}!</b>`
    })
}
 

// sendWelcomeEmail('www.chitizsambhav@gmail.com', 'Chitiz')
// sendWelcomeEmail('www.chitizsambhav@gmail.com', 'chitiz')
module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}