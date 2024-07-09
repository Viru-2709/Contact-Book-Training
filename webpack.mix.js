let mix = require('laravel-mix');

mix.styles([
    './resources/assets/css/style.css',
    './resources/assets/css/toast.css',
], './public/assets/css/headers.min.css')

    .styles([
        './resources/assets/css/dashboard.css',
        './resources/assets/css/toast.css'
    ], './public/assets/css/user_headers.min.css')

    .js([
        './resources/assets/js/dashboard.js',
        './resources/assets/js/logout.js'
    ], './public/assets/js/user_footer.min.js')

    .js([
        './resources/assets/js/reset_password.js'
    ], './public/assets/js/reset_password.min.js')

    .js([
        './resources/assets/js/forget_password.js'
    ], './public/assets/js/forget_password.min.js')

    .js([
        './resources/assets/js/registration.js',
    ], './public/assets/js/regstration.min.js')

    .js([
        './resources/assets/js/resend_mail.js'
    ], './public/assets/js/resend_mail.min.js')

    .js([
        './resources/assets/js/login.js',
    ], './public/assets/js/login.min.js')

    .js([
        './resources/assets/js/contact.js'
    ], './public/assets/js/contact.min.js')

    .js([
        './resources/assets/js/group.js'
    ], './public/assets/js/group.min.js')