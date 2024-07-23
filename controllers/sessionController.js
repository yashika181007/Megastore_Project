// controllers/sessionController.js

const DisplaySessionData = (req, res) => {
    // Retrieve session data
    const username = req.session.username;
    if (username) {
        req.flash('success', 'Login successful');

        // req.flash('success', `Welcome, ${username}!`); // Set flash message
    } else {
        req.flash('error', 'User not authenticated'); // Set flash message
    }
    
    // Redirect to another route (e.g., home page)
    res.redirect('/home');
};

module.exports = {
    DisplaySessionData
};
