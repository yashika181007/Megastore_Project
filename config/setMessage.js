// middleware/setMessage.js
module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        const username = req.session.username || 'User';
        res.locals.message = ` ${username}!`;
    } else {
        res.locals.message = null;
    }
    next();
};
