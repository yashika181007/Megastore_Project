exports.index = (req, res) => {
    if (req.session.isLoggedIn) {
        const username = req.session.username || 'User';
        res.render('home', {
            message: ` ${username}!`
            
        });
    } 
};
