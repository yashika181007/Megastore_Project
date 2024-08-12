const db = require('../config/database');
const sessionMiddleware = require('../config/session');

class Adminlogin {
    static async signIn(username, password) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM admin_details WHERE username = ? AND password = ?',
                [username, password]
            );

            if (rows.length === 0) {
                return null; 
            }
           
            return rows[0]; 
        } catch (error) {
            throw error;
        }
    }
}

module.exports = {
    Adminlogin
};
