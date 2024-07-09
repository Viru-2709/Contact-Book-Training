const Usertoken = require('../model/user_token.model');
const { error_res } = require('../library/general');

exports.userAuthentication = async function (req, res, next) {
    try {
        if (!req.session || !req.session.user || !req.session.user.id) {
            return res.redirect('/');
        }
        req.userId = req.session.user.id;
        req.usertoken = req.session.user.token;

        const checkuser = await Usertoken.findOne({ user_id: req.userId, token: req.usertoken });
        if (!checkuser) {
            req.session.destroy();
            return res.redirect('/');
        }

        next();
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.userNotAuthenticated = async function (req, res, next) {
    if (!req.session.user) {
        next();
    } else {
        res.redirect('/user/dashboard');
    }
}