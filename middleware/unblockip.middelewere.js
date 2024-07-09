const BlockIP = require('../model/blockip.model');
const { error_res } = require('../library/general');
const blockTime = 1;

exports.unblockIP = async function (req, res, next) {
    try {
        const clientIp = req.ip.split(":").pop();

        const blockDurationMilliseconds = blockTime * 60 * 1000;
        const blockDurationAgo = Date.now() - blockDurationMilliseconds;

        const blockIP = await BlockIP.findOne({ ip: clientIp });

        if (blockIP) {

            const isBlocked = blockIP.created_at.getTime() < blockDurationAgo;

            if (isBlocked) {
                await BlockIP.deleteOne({ ip: clientIp });
                console.log("IP", clientIp, "unblocked successfully.");
            }
        };
        next();
    } catch (error) {
        console.error("Error unblocking IP:", error.message);
        return res.json(error_res(error.message));
    };
};