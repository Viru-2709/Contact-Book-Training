const nodemailer = require('nodemailer');

exports.imagepath = '/resources/assets/image/';

exports.formatCreatedTime = (created_at) => {
    const timeDiff = new Date() - created_at;
    let displayTime;

    if (timeDiff < 60000) {
        displayTime = "Just Now";
    } else if (timeDiff < 3600000) {
        displayTime = `${Math.floor(timeDiff / 60000)} Min Ago`;
    } else if (timeDiff < 86400000) {
        displayTime = `${Math.floor(timeDiff / 3600000)} Hours Ago`;
    } else if (timeDiff < 604800000) {
        displayTime = `${Math.floor(timeDiff / 86400000)} Days Ago`;
    } else if (timeDiff < 2629800000) {
        displayTime = `${Math.floor(timeDiff / 604800000)} Weeks Ago`;
    } else {
        displayTime = `${Math.floor(timeDiff / 2629800000)} Months Ago`;
    };
    return displayTime;
};

function padZero(value, length = 2) {
    return String(value).padStart(length, '0');
};

exports.formatDate = (date) => {
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

exports.success_res = (msg = "Success", data = []) => {
    return {
        flag: 1,
        msg,
        data
    };
};

exports.error_res = (msg = 'Error') => {
    return {
        flag: 0,
        msg
    };
};

exports.sendEmail = async (email, token) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILID,
            pass: process.env.MAILPASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAILID,
        to: email,
        subject: subject,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            error('Error sending email:', error);
        } else {
            info('Email sent:', info.response);
        }
    });

}