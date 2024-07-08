const User = require('../model/User');
const bcrypt = require('bcrypt');

// define handler for user information
const handleNewUser = async (req, res) => {
    // deconsturct from the body
    const { user, pwd } = req.body;

    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate username in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); // conflict error

    try {
        // encrypt the password using bcrypt
        const hashedPwd = await bcrypt.hash(pwd, 10); // add salt for additional protection

        // create and store the new user in mongodb
        const result = await User.create({
            "username": user,
            // roles": { "User": 2001 }-default data in schema not needed here
            "password": hashedPwd
        });

        res.status(201).json({ 'message': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    };
};

module.exports = { handleNewUser };