const mongoose = require('mongoose');
const { formatCreatedTime } = require('../library/general');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    number: {
        type: Number,
    },
    image: {
        type: String,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },

}, { timestamps: { createdAt: "created_at" } });

contactSchema.virtual("format_created_time").get(function () {
    return formatCreatedTime(this.created_at);
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;