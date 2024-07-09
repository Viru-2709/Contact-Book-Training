const ejs = require('ejs');
const Group = require('../model/group.model');
const { success_res, error_res } = require("../library/general");
const { error, info } = require('../logger/logger');

exports.postAddGroup = async function (req, res) {
    try {
        req.body.user_id = req.userId;
        const existingGroup = await Group.findOne({ name: { $regex: new RegExp('^' + req.body.name + '$', 'i') }, user_id: req.userId });
        if (existingGroup) {
            error("Group already exists");
            return res.json(error_res("This Group already exists"));
        };
        const group = await Group.create(req.body);
        info("Group Add SuccessFully");
        return res.json(success_res('Group Add SuccessFully', group));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.patchUpdateGroup = async function (req, res) {
    try {
        const groupId = req.params.id;
        const existingGroup = await Group.findOne({
            name: { $regex: new RegExp('^' + req.body.name + '$', 'i') },
            user_id: req.userId,
            _id: { $ne: groupId }
        });
        if (existingGroup) {
            error("Group already exists");
            return res.json(error_res("This Group already exist"));
        };
        const updatedGroup = await Group.findOneAndUpdate({ _id: groupId, user_id: req.userId }, req.body, { new: true });
        if (!updatedGroup) {
            error("Unauthorized user");
            return res.json(error_res("Unauthorized user"));
        };
        info("Group Updated Successfully");
        return res.json(success_res('Group Updated Successfully', updatedGroup));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.deleteGroup = async function (req, res) {
    try {
        const group_id = req.params.id;
        const group = await Group.findOneAndDelete({ _id: group_id, user_id: req.userId });
        if (!group) {
            error("Unauthorized user");
            return res.json(error_res("Unauthorized user"));
        };
        info("Group Deleted SuccessFully");
        return res.json(success_res('Group Deleted SuccessFully', group));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.getGroupList = async function (req, res) {
    const userData = req.session.user;
    try {
        res.render('group', {
            header: { title: "Group" },
            data: { name: userData.name },
            footer: {},
        });
    } catch (error) {
        return res.json(error_res(error.message));
    };
};

exports.postGroupList = async function (req, res) {
    try {
        const page = parseInt(req.body.page);
        const limit = parseInt(req.body.limit);
        const skip = (page - 1) * limit;
        const search_name = req.body.search_name;

        const query = {
            user_id: req.userId
        };

        if (search_name) {
            query.name = { $regex: search_name, $options: 'i' };
        };

        const total = await Group.countDocuments(query);
        const totalPage = Math.ceil(total / limit);
        const group = await Group.find(query).populate("user_id").skip(skip).limit(limit).sort({ _id: -1 }).exec();
        const views = await ejs.renderFile('./views/group_list.ejs', {
            body: {
                group: group,
                totalPage: totalPage,
                currentPage: page,
                prevPage: page - 1,
                nextPage: page + 1,
                search_name: search_name
            }
        });
        const data = {
            views: views,
            totalPage: totalPage,
            limit: limit
        };
        info('Group List Found SuccessFully');
        return res.json(success_res('Group List SuccessFully', data));
    } catch (error) {
        return res.json(error_res(error.message));
    };
};