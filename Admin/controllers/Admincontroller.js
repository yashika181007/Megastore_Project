const Admin = require('../models/Admin');

const Adminlogin = async (req, res) => {
    try {
        if (req.method === 'GET') {
            return res.render('Adminlogin');
        } else if (req.method === 'POST') {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            const user = await Admin.Adminlogin.signIn(username, password);
            if (!user) {
                return res.status(401).json({ error: 'Incorrect username or password' });
            }

            req.session.isLoggedIn = true;
            req.session.username = user.username;
            res.json({ message: 'Login successful' });
           
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/Adminlogin'); 
        }
    });
};
module.exports = {
    Adminlogin,
    logout
   
};
