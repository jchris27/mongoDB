const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    //evaluate the password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // grab the roles in the users json file
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' } // production 5m-15m
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // saving refreshToken with current user to DB
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // set the cookie and name it 'jwt'
        // during development remove secure: true for the thunder client to work
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); //1 day
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    };
};

module.exports = { handleLogin };