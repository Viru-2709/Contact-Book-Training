const mongoose = require('mongoose');
const { formatCreatedTime } = require('../library/general');

const Schema = mongoose.Schema;
const blockipSchema = new Schema({
    ip: String
}, { timestamps: { createdAt: "created_at" } });

blockipSchema.virtual("format_created_time").get(function () {
    return formatCreatedTime(this.created_at);
});

const BlockIP = mongoose.model('blockips', blockipSchema);

module.exports = BlockIP;