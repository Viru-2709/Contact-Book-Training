const User = require("../model/user.model");
const Usertoken = require('../model/user_token.model');
const Contact = require("../model/contact.model");
const Group = require('../model/group.model');
const BlockIP = require('../model/blockip.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { success_res, error_res, sendEmail } = require("../library/general");
const { error, info } = require('../logger/logger');
const passport = require('passport');

exports.postRegistration = async function (req, res) {
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ username: { $regex: new RegExp('^' + username + '$', 'i') } }, { email }] });
        if (existingUser) {
            if (existingUser.username.toLowerCase() === username.toLowerCase()) {
                error("This Username already exists");
                return res.json(error_res("This Username already exists"));
            }
            if (existingUser.email === email) {
                error("This Email already exists");
                return res.json(error_res("This Email already exists"));
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, username, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(user._id, { verificationToken: token });

        subject = "Verify your Email",
            htmlContent = `Please click the link to verify your email <br>
        <a href="${process.env.NODE_URL}/verify/${token}">Verify Account</a>`;
        await sendEmail(email, token);
        user.save();

        info("Register Successfully Please Activete Your Account Before Login")
        return res.json(success_res('Register Successfully Please Activate Your Account Before Login', user));
    } catch (error) {
        return res.json(error_res(error.message));
    }
};

exports.getVerify = async function (req, res) {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            res.render('404', {
                header: { title: "404 not found" },
                data: {}
            });
            return
        }
        user.status = 1;
        user.verificationToken = null;
        user.save();
        res.render('verify', {
            header: { title: "Verify" },
            data: {}
        });

    } catch (error) {
        return res.json(error_res(error.message))
    }
};

exports.postLogin = async function (req, res) {
    try {
        const { emailORusername, password } = req.body;
        const user = await User.findOne({ $or: [{ email: emailORusername }, { username: emailORusername }] });

        if (!user) {
            error("User not found")
            return res.json(error_res("User Not Found"));
        };

        if (user.googleId) {
            return res.json(error_res("User Not Found"));
        }

        if (user.status === 0) {
            error("Please activate Your Account Before Login");
            return res.json(error_res("You need to activate your account before you can login"));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await user.incrementLoginAttempts();

            if (user.loginAttempts >= 3) {
                const blockIP = await BlockIP.findOne({ ip: req.ip.split(":").pop() });

                if (!blockIP) {
                    await user.resetLoginAttempts();
                };

                await BlockIP.create({ ip: req.ip.split(":").pop() });
                error("Your account is blocked because you attempted to login 3 or more times with the wrong password.");
                return res.json(error_res("Your account is blocked because you attempted to login 3 or more times with the wrong password."));
            };
            error("Invalid Password")
            return res.json(error_res("Invalid Password"));
        };

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        const userToken = new Usertoken({
            token: token,
            user_id: user._id
        });
        await userToken.save();

        req.session.user = {
            id: user._id,
            username: user.username,
            name: user.name,
            token: userToken.token
        };
        await user.resetLoginAttempts();

        const data = {
            token,
            user
        };
        return res.json(success_res('Login Successfully', data));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postResend = async function (req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            error("User not found");
            return res.json(error_res("User Not Found"));
        };
        if (user.status === 1) {
            error("User not found");
            return res.json(error_res("Your account already activated"));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(user._id, { verificationToken: token });

        subject = "Verify your Email",
            htmlContent = `Please click the link to verify your email <br>
        <a href="${process.env.NODE_URL}/verify/${token}">Verify Account</a>`;
        await sendEmail(email, token);
        user.save();

        info("Mail Send Successfully")
        return res.json(success_res('Mail Send Successfully', user));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.getRegistration = async function (req, res) {
    try {
        res.render('registration', {
            header: { title: "Registration" },
            data: {},
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.getResend = async function (req, res) {
    try {
        res.render('resend_mail', {
            header: { title: "Resendmail" },
            data: {},
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.getLogin = async function (req, res) {
    try {
        res.render('login', {
            header: { title: "Login" },
            data: {},
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.getDashboard = async function (req, res) {
    const userData = req.session.user;
    try {
        res.render('dashboard', {
            header: { title: "Dashboard" },
            data: { name: userData.name },
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postDashboard = async function (req, res) {
    try {
        const userData = req.session.user;
        const count = await Contact.countDocuments({ user_id: req.userId });
        const groupCount = await Group.countDocuments({ user_id: req.userId });
        const usertoken = await Usertoken.findOne({ user_id: req.userId });
        const data = {
            contact_count: count,
            group_count: groupCount,
            token: usertoken.token,
            name: userData.name
        };
        info("User Dashboard");
        return res.json(success_res('User Count Successfully', data));
    } catch (error) {
        return res.json(error_res(error.message));
    }
};

exports.getForgetPassword = async function (req, res) {
    try {
        res.render('forget_password', {
            header: { title: "Forget Password" },
            data: {},
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postForgetPassword = async function (req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            error("User not found");
            return res.json(error_res("User Not Found"));
        };
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(user._id, { resetToken: token });

        subject = "Forget Password",
            htmlContent = `Please click the link to reset password <br>
        <a href="${process.env.NODE_URL}/resetpassword/${token}">Forget Password</a>`;
        sendEmail(email, token);

        return res.json(success_res("Email sent successfully"));
    }
    catch (error) {
        return res.json(error_res(error.message));
    };
}

exports.getResetPassword = async function (req, res) {
    try {
        const token = req.params.token;
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            res.render('404', {
                header: { title: "404 not found" },
                data: {}
            });
            return
        }
        res.render('reset_password',
            {
                token: token,
                header: { title: "Reset Password" },
                data: {}
            }
        );
        user.save();
    }
    catch (error) {
        return res.json(error_res(error.message));
    }
}

exports.postResetPassword = async function (req, res) {
    try {
        const token = req.body.token;
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            error("User not found");
            return res.json(error_res("User Not Found"));
        };
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        if (req.session && req.session.user && req.session.user.id) {
            const userId = req.session.user.id;
            await User.findByIdAndUpdate(user._id, { password: hashedPassword, resetToken: null });
            await Usertoken.deleteMany({ user_id: userId });
            req.session.destroy();
        }
        else {
            await User.findByIdAndUpdate(user._id, { password: hashedPassword, resetToken: null });
            req.session.destroy();
        }
        return res.json(success_res("Password reset successfully"));
    }
    catch (error) {
        return res.json(error_res(error.message));
    }
}

exports.postLogout = async function (req, res) {
    try {
        if (req.session && req.session.user && req.session.user.id) {
            const userId = req.session.user.id;
            await Usertoken.deleteMany({ user_id: userId });
            req.session.destroy((err) => {
                if (err) {
                    return res.json(error_res("Failed to logout"));
                }
                return res.json(success_res("Logout Successfully"));
            });
        }
    } catch (error) {
        return res.json(error_res(error.message));
    }
}

exports.getPassportAuth = (req, res, next) => {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
};

exports.getGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, async (err, profile, info) => {
        if (err) {
            return res.redirect('/?error=' + encodeURIComponent('An error occurred during authentication.'));
        }
        if (!profile) {
            return res.redirect('/?error=' + encodeURIComponent('No profile information retrieved.'));
        }

        try {
            let user = await User.findOne({ email: profile.email });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.family_name,
                    username: profile.given_name,
                    email: profile.email,
                });
                await user.save();
            }

            if (!user.googleId) {
                return res.redirect('/?error=' + encodeURIComponent('User not found.'));
            }

            req.logIn(user, (err) => {
                if (err) {
                    return res.redirect('/?error=' + encodeURIComponent('Login error.'));
                }
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                const userToken = new Usertoken({
                    token: token,
                    user_id: user._id
                });
                userToken.save();

                req.session.user = {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    token: userToken.token
                };
                return res.redirect('/user/dashboard');
            });
        } catch (err) {
            return res.redirect('/?error=' + encodeURIComponent('Server error.'));
        }
    })(req, res, next);
};