const mongoose = require('mongoose');
const { formatCreatedTime } = require('../library/general');

const Schema = mongoose.Schema;

const usertokenSchema = new Schema({
    token: {
        type: String
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },

}, { timestamps: { createdAt: "created_at" } });

usertokenSchema.virtual("format_created_time").get(function () {
    return formatCreatedTime(this.created_at);
});

const Usertoken = mongoose.model('usertoken', usertokenSchema);

module.exports = Usertoken;