const User = require('../model/User');

const handleLogout = async (req, res) => {
    // *NOTE: On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content

    // Is refreshTOken in DB?
    const refreshToken = cookies.jwt;
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    // during development remove secure: true for the thunder client to work
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', });
        return res.sendStatus(204);
    }

    // Delete the refreshToken in DB
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log(result);

    // during development remove secure: true for the thunder client to work
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, });
    res.sendStatus(204);
};

module.exports = { handleLogout };