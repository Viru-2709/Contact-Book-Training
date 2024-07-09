const ejs = require('ejs');
const Contact = require('../model/contact.model');
const Group = require("../model/group.model");
const { imagepath } = require('../library/general');
const { success_res, error_res } = require("../library/general");
const { error, info } = require('../logger/logger')

exports.postAddContact = async function (req, res) {
    try {
        if (req.file) {
            if (!req.file.mimetype.startsWith('image')) {
                error("Only image files are allowed");
                return res.json(error_res("Only image files are allowed"));
            };
            req.body.image = req.file.filename;
        };
        const existingContact = await Contact.findOne({ $or: [{ email: req.body.email }, { number: req.body.number }], user_id: req.userId });
        if (existingContact) {
            if (existingContact.email === req.body.email) {
                error("This Email already exists");
                return res.json(error_res("This Email already exists"));
            } else {
                error("This Contact Number already exists");
                return res.json(error_res("This Contact Number already exists"));
            }
        };
        req.body.user_id = req.userId;
        var contact = await Contact.create(req.body);
        info("Contact Added Successfully");
        return res.json(success_res('Contact Added Successfully', contact));
    } catch (error) {
        error(error.message);
        return res.json(error_res(error.message));
    }
};

exports.patchUpdateContact = async function (req, res) {
    try {
        if (req.file) {
            if (!req.file.mimetype.startsWith('image')) {
                error("Only image files are allowed");
                return res.json(error_res("Only image files are allowed"));
            };
            req.body.image = req.file.filename;
        };
        const contact_id = req.params.id;
        const contact = await Contact.findOne({ _id: req.params.id, user_id: req.userId });
        if (!contact) {
            error("Unauthorized User");
            return res.json(error_res("Unauthorized User"))
        }
        const existingContact = await Contact.findOne({ $or: [{ email: req.body.email }, { number: req.body.number }], user_id: req.userId, _id: { $ne: contact_id } });
        if (existingContact) {
            if (existingContact.email === req.body.email) {
                error("This Email already exists");
                return res.json(error_res("This Email already exists"));
            } else {
                error("This Contact Number already exists");
                return res.json(error_res("This Contact Number already exists"));
            }
        }
        await Contact.findByIdAndUpdate(contact_id, req.body);
        info("Contact Updated Successfully");
        return res.json(success_res('Contact Updated Successfully', contact));
    } catch (error) {
        error(error.message);
        return res.json(error_res("This Contact Number already exists"));
    }
};

exports.deleteContact = async function (req, res) {
    try {
        const contacts_id = req.params.id;
        const contact = await Contact.findOne({ _id: contacts_id, user_id: req.userId });
        if (!contact) {
            error("Unauthorized user");
            return res.json(error_res("Unauthorized user"));
        };
        await Contact.findByIdAndDelete(contacts_id);
        info("Contact Deleted SuccessFully");
        return res.json(success_res('Contact Deleted SuccessFully', contact));
    } catch (error) {
        error(error.message);
        return res.json(error_res(error.message));
    };
};

exports.getContactList = async function (req, res) {
    const userData = req.session.user;
    try {
        return res.render('contact', {
            header: { title: "Contact" },
            data: { name: userData.name },
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postContactList = async function (req, res) {
    try {
        const page = parseInt(req.body.page);
        const limit = parseInt(req.body.limit);
        const skip = (page - 1) * limit;
        const search_name = req.body.search_name;
        const search_email = req.body.search_email;
        const search_number = req.body.search_number;
        const search_group = req.body.search_group;

        const query = {
            user_id: req.userId
        };

        if (search_name) {
            query.name = { $regex: search_name, $options: 'i' };
        }

        if (search_email) {
            query.email = { $regex: search_email, $options: 'i' };
        }

        if (search_number) {
            query.number = search_number;
        }

        if (search_group) {
            query.group = search_group;
        }

        const total = await Contact.find(query).countDocuments();
        const totalPage = Math.ceil(total / limit);
        const contact = await Contact.find(query).populate("user_id").populate("group").skip(skip).limit(limit).sort({ _id: -1 }).exec();
        const views = await ejs.renderFile('./views/contact_list.ejs', {
            body: {
                contact: contact,
                imagepath: imagepath,
                totalPage: totalPage,
                currentPage: page,
                prevPage: page - 1,
                nextPage: page + 1,
                search_name: search_name,
                search_email: search_email,
                search_number: search_number,
                search_group: search_group,
            }
        });
        const data = {
            views: views,
            totalPage: totalPage,
            limit: limit,
        };
        return res.json(success_res('Contact List Found SuccessFully', data));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postContactgroup = async function (req, res) {
    try {
        const group = await Group.find({ user_id: req.userId });
        return res.json(success_res('Contact Group Founded SuccessFully', group));
    } catch (error) {
        return res.json(error(error.message));
    };
};