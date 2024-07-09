const mongoose = require('mongoose');
const { formatCreatedTime } = require('../library/general');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },

}, { timestamps: { createdAt: "created_at" } });

groupSchema.virtual("format_created_time").get(function () {
    return formatCreatedTime(this.created_at);
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;