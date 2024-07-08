const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found.' });
    res.json(users);
};

const updateUser = async (req, res) => {
    if (!req?.body?.username || !req?.body?.oldPass || !req?.body?.newPass) return res.status(400).json({ 'message': 'Username | Password | New Password required.' });

    const user = await User.findOne({ username: req.body.username });

    // verify if the old pass matches in the db
    const match = await bcrypt.compare(req.body.oldPass, user.password);

    if (!match) return res.status(400).json({ 'message': 'Old password does not match with the DB' });

    const newHashedPwd = await bcrypt.hash(req.body.newPass, 10);

    user.username = req.body.username;
    user.password = newHashedPwd;

    const result = await user.save();

    res.status(200).json(result);
};

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required.' });

    const user = await User.findOne({ _id: req.body.id });

    if (!user) return res.status(204).json({ 'message': `No user ID ${req.body.id} found.` });

    const result = await User.deleteOne({ _id: req.body.id });

    res.status(200).json(result);
};

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Missing User ID in the parameter.' });

    const user = await User.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(204).json({ 'message': `No user ID ${req.params.id} found.` });

    res.status(200).json(user);
};

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
};