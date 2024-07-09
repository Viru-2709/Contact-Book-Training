const BlockIP = require('../model/blockip.model');
const { error_res } = require("../library/general");

exports.blockIP = async function (req, res, next) {
    try {
        var clientIp = req.ip.split(":").pop();
        const blockIP = await BlockIP.findOne({ ip: clientIp });
        if (blockIP) {
            return res.render("403", {
                header: {
                    title: "403 Access Denied",
                },
                body: {},
                footer: {},
            });
        };
        next();
    } catch (error) {
        return res.json(error_res(error.message));
    };
};